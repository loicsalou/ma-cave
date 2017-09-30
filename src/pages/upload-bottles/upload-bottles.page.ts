import {Component} from '@angular/core';
import {IonicPage, Loading, LoadingController, NavController, Platform} from 'ionic-angular';
import {FileChooser} from '@ionic-native/file-chooser';
import {FilePath} from '@ionic-native/file-path';
import * as _ from 'lodash';
import {BottlePersistenceService} from '../../service/bottle-persistence.service';
import {NotificationService} from '../../service/notification.service';
import {NativeStorageService} from '../../service/native-storage.service';
import {User} from '../../model/user';
import {ImportProvider} from '../../providers/import/import';
import {LoginService} from '../../service/login.service';

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
  from: number = 0;
  nbRead: number = 999;
  encoding: string; // forcer l'encoding
  optionsVisibles: boolean = false; // forcer l'encoding
  deleteBefore: boolean = true;
  localStorageKeys: any;
  tempValue: any;

  constructor(private navCtrl: NavController,
              private filepath: FilePath,
              private fileChooser: FileChooser,
              private notificationService: NotificationService,
              private bottleService: BottlePersistenceService,
              private loginService: LoginService,
              private platform: Platform,
              private localStorage: NativeStorageService,
              private loadingController: LoadingController,
              private importProvider: ImportProvider) {
  }

  deleteAccount() {
    this.notificationService.ask('question', 'app.confirm').take(1).subscribe(
      result => {
        if (result) {
          this.bottleService.deleteAccountData().subscribe(
            result => this.loginService.deleteAccount()
          );
        }
      }
    );
  }

  logout() {
    this.loginService.logout();
    this.navCtrl.popToRoot();
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
      .catch(err => {
        //alert('accès aux clés KO ' + err)
      });
  }

  /**
   * si Cordova seulement
   **/
  public chooseFile() {
    this.fileChooser.open()
      .then(uri => {
        this.filepath.resolveNativePath(uri).then((nativepath) => {
          (<any>window).resolveLocalFileSystemURL(nativepath, (res) => {
            res.file((resFile) => {
              this.setupUpload(resFile);
            })
          })
        })
          .catch(error => this.notificationService.error('uri incorrecte ' + uri + ' error:' + error));
      })
      .catch(error => {
        this.notificationService.error('Erreur lors du choix du fichier', error);
      });
  }

  public readBrowserFile(event: any) {
    //let textType = /text.*/;
    let file = event.currentTarget.files[ 0 ];
    this.setupUpload(file);
  }

  public emptyLockers() {
    this.bottleService.allBottlesObservable.take(1).subscribe(
      bottles => {
        let updatedBottles = bottles.map(
          bottle => {
            bottle.positions = [];
            return bottle;
          }
        );
        this.bottleService.update(updatedBottles);
      }
    )
  }

  private setupUpload(file: any) {
    if (this.deleteBefore) {
      this.bottleService.deleteBottles();
    }
    this.bottleService.disconnectListeners();
    let loading = this.loadingController.create({
                                                  spinner: 'bubbles',
                                                  content: 'Importation en cours...'
                                                });
    loading.present().then(
      () => {
        this.processParsing(loading, file);
      }
    ).catch(
      err => {
        this.notificationService.error('Erreur durant le process d\'importation !' + err);
        this.dismissLoading(loading);
      }
    )
  }

  private processParsing(loading: Loading, file: File) {
    let nbBottles = 0;
    let parsedBottles = [];
    let saved = 0;
    let startTimestamp = new Date().getTime();
    this.importProvider.parseFile(file)
      .subscribe(bottle => {
                   parsedBottles.push(bottle);
                   //ralentit très fortement le device (android en tout cas)
                   //loading.setContent('Analyse du lot ' + nbBottles++);
                 },
                 err => {
                   this.notificationService.error('Erreur de parsing: ' + err);
                   this.dismissLoading(loading);
                 },
                 () => {
                   this.dismissLoading(loading);
                   loading = this.loadingController.create({
                                                             spinner: 'bubbles',
                                                             content: 'Sauvegarde de ' + parsedBottles.length + ' lots : '
                                                           });
                   loading.present().then(
                     () => {
                       this.bottleService.save(parsedBottles).then(
                         () => {
                           this.dismissLoading(loading);
                           let endTimestamp = new Date().getTime();
                           this.notificationService.askNoChoice('app.information', 'app.importation-successful',
                                                                {time: (endTimestamp - startTimestamp)})
                             .subscribe(
                               () => {
                                 //this.forceLogout(loading);
                                 this.bottleService.reconnectListeners();
                               }
                             );
                         }
                       )
                     }
                   ).catch(
                     err => {
                       this.notificationService.error('Erreur durant le process d\'importation !' + err);
                       this.dismissLoading(loading);
                     }
                   )
                 }
      );
  }

  private dismissLoading(loading: Loading) {
    if (loading) {
      loading.dismiss();
    }
  }

  showLocalStorage() {
    this.listLocalStorageData();
    let u1: User = <User> {
      user: 'u1',
      email: 'mail1',
      photoURL: '',
      displayName: '',
      phoneNumber: '',
      uid: ''
    };
  }

  loadTempValueFor(key) {
    this.localStorage.getValue(key)
      .then(v => this.tempValue = JSON.stringify(v))
      .catch(err => {
        //alert('accès à la valeur de ' + key + ' KO: ' + JSON.stringify(err))
      });
  }

  private forceLogout(loading: Loading) {
    this.notificationService.askNoChoice('app.must-logout-title', 'app.must-logout').subscribe(
      () => this.logout()
    )
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
