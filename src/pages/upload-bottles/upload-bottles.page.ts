import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, Platform} from 'ionic-angular';
import {FileChooser} from '@ionic-native/file-chooser';
import {FilePath} from '@ionic-native/file-path';
import * as _ from 'lodash';
import {BottleFactory} from '../../model/bottle.factory';
import {BottlePersistenceService} from '../../service/bottle-persistence.service';
import {Bottle} from '../../model/bottle';
import {NotificationService} from '../../service/notification.service';
import {Http} from '@angular/http';
import {NativeStorageService} from '../../service/native-storage.service';
import {User} from '../../model/user';
import {ImportProvider} from '../../providers/import/import';

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
  debugMode: boolean = false;
  deleteBefore: boolean = true;
  localStorageKeys: any;
  tempValue: any;

  constructor(public navCtrl: NavController,
              private filepath: FilePath,
              private fileChooser: FileChooser,
              private notificationService: NotificationService,
              private bottleService: BottlePersistenceService,
              private bottleFactory: BottleFactory,
              private platform: Platform,
              private localStorage: NativeStorageService,
              private http: Http,
              private loadingController: LoadingController,
              private importProvider: ImportProvider) {
  }

  public platformIsCordova(): boolean {
    return this.platform.is('cordova');
  }

  public switchAdvancedOptions() {
    this.optionsVisibles = !this.optionsVisibles;
  }

  public listLocalStorageData() {
    this.localStorage.getList()
      .then(keys => {
        this.localStorageKeys = keys;
      })
      .catch(err => alert('accès aux clés KO ' + err));
  }

  public chooseFile() {

    this.fileChooser.open()
      .then(uri => {
        this.filepath.resolveNativePath(uri).then((result) => {
          let nativepath = result;
          this.readFile(nativepath);
        })
          .catch(error => this.notificationService.error('uri incorrecte ' + uri + ' error:' + error));
      })
      .catch(error => {
        this.notificationService.error('Erreur lors du choix du fichier', error);
      });
  }

  public saveBottles() {
    try {
      if (this.deleteBefore) {
        this.bottleService.deleteBottles();
      }
      this.bottleService.initializeDB(this.bottles);
      this.bottles = null;
    } catch (error) {
      this.notificationService.error('La sauvegarde des données a échoué', error);
    }
  }

  private readFile(nativepath: any) {
    try {
      let self = this;
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
    } catch (error) {
      this.notificationService.error('Le readFile(' + nativepath + ') a échoué', error);
    }
  }

  private parsedBottles: Bottle[] = [];

  public readBrowserFile(event: any) {
    //let textType = /text.*/;
    let file = event.currentTarget.files[ 0 ];
    this.importProvider.progressObservable().subscribe(
      step => {
        if (step.startsWith('ligne')) {
          let loading = this.loadingController.create({
                                                  spinner: 'hide',
                                                  content: 'Loading Please Wait...'
                                                });
        }
        console.info(step);
      },
      err => console.error(err),
      () => console.info('progression complete')
    );

    this.importProvider.parseFile(file)
      .subscribe(bottle => this.parsedBottles.push(bottle),
                 err => console.error(err),
                 () => console.info('number of bottles parsed: ' + this.parsedBottles.length)
      )
  }

  private readBrowserFile2(event: any) {
    //let textType = /text.*/;
    let file = event.currentTarget.files[ 0 ];
    let isXls = file.name.toLowerCase().endsWith('.xls');
    let encoding = isXls ? 'windows-1252' : 'utf-8';
    //console.info(event.currentTarget.files[ 0 ]);
    let reader = new FileReader();
    let self = this;
    reader.onload = function (evt) {
      self.fileContent = evt.target[ 'result' ];
      if (isXls) {
        self.parseContentXLS();
      } else {
        self.parseContentCSV();
      }
      self.saveBottles();
    }
    reader.onerror = function (evt) {
      self.notificationService.error('cannot read the file ! ' + file);
    };
    reader.readAsText(file, encoding);
  }

  private parseContentCSV() {
    let csvarray = this.fileContent.split('\n');
    let keys = _.first(csvarray).split(';');
    let values = _.drop(csvarray, 1 + this.from);
    values = _.take(values, this.nbRead);
    let bottles = [];
    let self = this;
    try {
      bottles = _.filter(values, row => row.trim().length > 1)
        .map(
          row => {
            try {
              let btl: Bottle = <Bottle>buildObject(row, keys);
              return self.bottleFactory.create(btl);
            } catch (error) {
              self.notificationService.error('Erreur d\'analyse de l\'enregistrement: ' + row, error);
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
    let bottles = _.filter(values, row => row.trim().length > 1)
      .map(
        row => {
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

  test() {
    this.listLocalStorageData();
    let u1: User = <User> {
      user: 'u1',
      email: 'mail1',
      photoURL: '',
      displayName: '',
      phoneNumber: '',
      uid: ''
    };

    //let btl1 = [];
    //let btl2 = [];
    //this.http.get('../../assets/json/ma-cave-mini1.json').subscribe(
    //  response => {
    //    btl1 = response.json()
    //    this.http.get('../../assets/json/ma-cave-mini2.json').subscribe(
    //      response => {
    //        btl2 = response.json();
    //        this.playWith(btl1, btl2);
    //      }
    //    );
    //  }
    //);
  }

  private playWith(btl1: Array<Bottle>, btl2: Array<Bottle>) {
    //btl1 vient de firebase, bt2 du cache
    btl1 = btl1.sort(function (a, b) {
      if (a[ '$key' ] === b[ '$key' ]) {
        return 0;
      }
      return a[ '$key' ] < b[ '$key' ] ? -1 : 1;
    });
    btl2 = btl2.sort(function (a, b) {
      if (a[ '$key' ] === b[ '$key' ]) {
        return 0;
      }
      return a[ '$key' ] < b[ '$key' ] ? -1 : 1;
    });

    //liste les bouteilles de btl1 qui ne sont pas dans btl2
    let diff = _.differenceWith(btl1, btl2, function (a, b) {
      return (a.lastUpdated === b.lastUpdated && a.$key === b.$key);
    });
    console.info('nombre de différences:' + diff.length);

    //create new cache: remove updated bottltes then add updated to cache bottles and we're done
    let newCache = _.pullAllWith(btl2, diff, function (a, b) {
      return (a.$key === b.$key);
    });
    btl2 = _.concat(btl2, diff);

    let diff2 = _.differenceWith(btl1, btl2, function (a, b) {
      return (a.lastUpdated === b.lastUpdated && a.$key === b.$key);
    });
    console.info('nombre de différences après refresh:' + diff2.length);
  }

  loadTempValueFor(key) {
    this.localStorage.getValue(key)
      .then(v => this.tempValue = JSON.stringify(v))
      .catch(err => alert('accès à la valeur de ' + key + ' KO: ' + JSON.stringify(err)));
  }
}

function buildObject(row: any, keys: any) {
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
