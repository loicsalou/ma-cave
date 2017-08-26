import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {BottlePersistenceService} from '../../service/bottle-persistence.service';
import {Observable} from 'rxjs/Observable';
import {Bottle} from '../../model/bottle';
import * as _ from 'lodash';
import {Subject} from 'rxjs/Subject';

/*
  Generated class for the ImportProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ImportProvider {

  bottleParsed: Subject<Bottle> = new Subject();
  bottleParsedObservable: Observable<Bottle> = this.bottleParsed.asObservable();

  constructor(public bottlesService: BottlePersistenceService) {
  }

  public parseFile(file: File): Observable<Bottle> {
    let isXls = file.name.toLowerCase().endsWith('.xls');
    let encoding = isXls ? 'windows-1252' : 'utf-8';

    let self = this;
    let reader = new FileReader();
    let bottles: Bottle[] = [];
    reader.onload = function (evt) {
      let fileContent = evt.target[ 'result' ];
      if (isXls) {
        bottles = self.parseContentXLS(fileContent);
      } else {
        bottles = self.parseContentCSV(fileContent);
      }
    }
    reader.onerror = function (evt) {
      self.bottleParsed.error('Le fichier ' + file.name + ' ne peut pas être lu');
    };
    reader.readAsText(file, encoding);

    return this.bottleParsed;
  }

  private parseContentCSV(fileContent): Bottle[] {
    let from = 0, nbRead = 999;
    let csvarray = fileContent.split('\n');
    let keys = _.first(csvarray).split(';');
    let values = _.drop(csvarray, 1 + from);
    values = _.take(values, nbRead);
    let bottles = [];
    try {
      bottles = _.filter(values, row => row.trim().length > 1)
        .map(
          (row, ix) => {
            try {
              let btl: Bottle = <Bottle>buildObjectFromCsv(row, keys);
              btl = this.bottlesService.createBottle(btl);
              this.bottleParsed.next(btl);
              return btl;
            } catch (error) {
              this.bottleParsed.error(error);
            }
          });
      this.bottleParsed.complete();
    } catch (error) {
      this.bottleParsed.error(error);
    }

    return bottles;
  }

  private parseContentXLS(fileContent) {
    let from = 0, nbRead = 9999;
    let csvarray = fileContent.split(/\r\n|\n/);
    let keys = _.first(csvarray).replace(/['"]+/g, '').split(/\t/);
    let values = _.drop(csvarray, 1 + from);
    values = _.take(values, nbRead);
    let bottles = [];
    try {
      _.filter(values, row => row.trim().length > 1)
        .map(
          (row, ix) => {
            try {
              let btl: Bottle = <Bottle>buildObjectFromXLS(row, keys);
              btl = this.bottlesService.createBottle(btl);
              this.bottleParsed.next(btl);
              return btl;
            } catch (error) {
              this.bottleParsed.error(error);
            }
          });
      this.bottleParsed.complete();
    } catch (error) {
      this.bottleParsed.error(error);
    }

    return bottles;
  }
}

function buildObjectFromCsv(row: any, keys: any) {
  let object = {};
  let values = row.split(';');
  if (values.length == 1) {
    return null;
  }
  _.each(keys, function (key, i) {
    if (i < values.length) {
      object[ key ] = values[ i ];
    } else {
      object[ key ] = '';
    }
  })
  return object;
}

function buildObjectFromXLS(row: any, keys: any) {
  let object = {};
  let rowString = row.replace(/['"]+/g, '');
  let values = rowString.split(/\t/);
  if (values.length == 1) {
    return null;
  }
  _.each(keys, function (key, i) {
    if (i < values.length) {
      object[ key ] = values[ i ];
    } else {
      object[ key ] = '';
    }
  })
  return object;
}
