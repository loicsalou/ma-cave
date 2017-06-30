import {Component} from '@angular/core';
import {IonicPage, NavController, Platform} from 'ionic-angular';
import {FileChooser} from '@ionic-native/file-chooser';
import {FilePath} from '@ionic-native/file-path';
import * as _ from 'lodash';
import {BottleFactory} from '../../model/bottle.factory';
import {BottleService} from '../../service/firebase-bottle.service';
import {Bottle} from '../../model/bottle';
import {NotificationService} from '../../service/notification.service';

/**
 * Generated class for the UploadBottles page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
             selector: 'page-upload-bottles',
             templateUrl: 'upload-bottles.page.html'
           })
export class UploadBottlesPage {
  oneBottle: string = '';
  fileContent: string = '<vide>';
  from: number = 0;
  nbRead: number = 999;
  viewNb: number = 0;
  private bottles: Bottle[] = null;
  encoding: string; // forcer l'encoding
  optionsVisibles: boolean = false; // forcer l'encoding

  constructor(public navCtrl: NavController,
              private filepath: FilePath,
              private fileChooser: FileChooser,
              private notificationService: NotificationService,
              private bottleService: BottleService,
              private bottleFactory: BottleFactory,
              private platform: Platform) {
  }

  public platformIsCordova(): boolean {
    return this.platform.is('cordova');
  }

  public switchAdvancedOptions() {
    this.optionsVisibles = !this.optionsVisibles;
  }

  public chooseFile() {
    this.fileChooser.open()
      .then(uri => {
        this.filepath.resolveNativePath(uri).then((result) => {
          let nativepath = result;
          this.readFile(nativepath);
        });
      })
      .catch(error => {
        this.notificationService.error('Erreur lors du choix du fichier', error);
      });
  }

  public saveBottles() {
    try {
      this.bottleService.initializeDB(this.bottles);
      this.bottles = null;
    } catch (error) {
      this.notificationService.error('La sauvegarde des données a échoué', error);
    }
  }

  private readFile(nativepath: any) {
    (<any>window).resolveLocalFileSystemURL(nativepath, (res) => {
                                              res.file((resFile) => {
                                                let reader = new FileReader();
                                                let isXls = resFile.name.toLowerCase().endsWith('.xls');
                                                if (this.encoding == null) {
                                                  this.encoding = isXls ? 'windows-1252' : 'utf-8';
                                                }
                                                reader.readAsText(resFile, this.encoding);
                                                reader.onloadend = (evt: any) => {
                                                  this.fileContent = evt.target.result;
                                                  if (isXls) {
                                                    this.parseContentXLS();
                                                  } else {
                                                    this.parseContentCSV();
                                                  }
                                                  this.saveBottles();
                                                }
                                              })
                                            }, err => this.notificationService.failed('La lecture du fichier ' + nativepath + ' a échoué' + err)
    );
  }

  private parseContentCSV() {
    let csvarray = this.fileContent.split('\n');
    let keys = _.first(csvarray).split(';');
    let values = _.drop(csvarray, 1 + this.from);
    values = _.take(values, this.nbRead);
    let bottles = [];
    let self = this;
    try {
      bottles = _.map(values, function (row) {
        try {
          let btl: Bottle = <Bottle>buildObject(row, keys);
          return self.bottleFactory.create(btl);
        } catch (error) {
          this.notificationService.error('Erreur d\'analyse de l\'enregistrement: ' + row, error);
        }
      }, {});
    } catch (error2) {
      this.notificationService.error('Erreur de parcours du fichier CSV', error2);
    }
    this.bottleService.setCellarContent(bottles);
    this.bottles = bottles;
    this.notificationService.information('Le chargement (CSV) de ' + csvarray.length + ' fichiers a été effectué.' +
                                         ' Nombre' +
                                         ' de lots' + (bottles == null ? 'KO' + ' !' : bottles.length));

    return this.bottles;
  }

  public parseContentXLS() {
    //let textType = /text.*/;
    let nbread = this.nbRead;
    let nbfrom = this.from;
    let csvarray = this.fileContent.split(/\r\n|\n/);
    let keys = _.first(csvarray).replace(/['"]+/g, '').split(/\t/);
    let values = _.drop(csvarray, 1 + nbfrom);
    values = _.take(values, nbread);
    let bottles = _.map(values, row => {
      try {
        let btl: Bottle = <Bottle>buildObjectFromXLS(row, keys);
        return this.bottleFactory.create(btl);
      } catch (error) {
        this.notificationService.error('Erreur d\'analyse de l\'enregistrement: ' + row, error);
      }
    }, error2 => this.notificationService.error('Erreur de parcours du fichier', error2));
    this.bottleService.setCellarContent(bottles);
    this.bottles = bottles;
    this.notificationService.information('Le chargement (XLS) de ' + csvarray.length + ' fichiers a été effectué.' +
                                         ' Nombre de lots' + (bottles == null ? 'KO' + ' !' : bottles.length));
  }
}

function buildObject(row: any, keys: any) {
  let object = {};
  let values = row.split(';');
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
  _.each(keys, function (key, i) {
    if (i < values.length) {
      object[ key ] = values[ i ];
    } else {
      object[ key ] = '';
    }
  })
  return object;
}
