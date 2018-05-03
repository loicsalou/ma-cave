import {Component} from '@angular/core';
import {Loading, LoadingController, NavController, Platform} from 'ionic-angular';
import {FileChooser} from '@ionic-native/file-chooser';
import {FilePath} from '@ionic-native/file-path';
import {BottlePersistenceService} from '../../../service/bottle-persistence.service';
import {NotificationService} from '../../../service/notification.service';
import {NativeStorageService} from '../../../service/native-storage.service';
import {ImportProvider} from '../../../providers/import/import';
import {LoginService} from '../../../service/login/login.service';
import {ApplicationState} from '../../../app/state/app.state';
import {Store} from '@ngrx/store';
import {BottlesQuery} from '../../../app/state/bottles.state';
import {DeleteAccountAction, LogoutAction} from '../../../app/state/shared.actions';

/**
 * Generated class for the UploadBottles page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
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
              private platform: Platform,
              private localStorage: NativeStorageService,
              private loadingController: LoadingController,
              private importProvider: ImportProvider,
              private store: Store<ApplicationState>) {
  }

  deleteAccount() {
    this.notificationService.ask('question', 'app.confirm').take(1).subscribe(
      result => {
        if (result) {
          this.store.dispatch(new DeleteAccountAction())
        }
      }
    );
  }

  logout() {
    this.store.dispatch(new LogoutAction());
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
            });
          });
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
    //this.bottleService.allBottlesObservable.take(1).subscribe(
    this.store.select(BottlesQuery.getBottles).take(1).subscribe(
      bottles => {
        let updatedBottles = bottles.map(
          bottle => {
            bottle.positions = [];
            return bottle;
          }
        );
        this.bottleService.update(updatedBottles);
      }
    );
  }

  public emptyLogs() {
    this.bottleService.deleteLogs();
  }

  showLocalStorage() {
    this.listLocalStorageData();
  }

  loadTempValueFor(key) {
    this.localStorage.getValue(key)
      .then(v => this.tempValue = JSON.stringify(v))
      .catch(err => {
        //alert('accès à la valeur de ' + key + ' KO: ' + JSON.stringify(err))
      });
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
    );
  }

  private processParsing(loading: Loading, file: File) {
    let parsedBottles = [];
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
                       this.bottleService.save(parsedBottles).take(1).subscribe(
                         () => {
                           this.dismissLoading(loading);
                           let endTimestamp = new Date().getTime();
                           this.notificationService.askNoChoice('app.information', 'app.importation-successful',
                                                                {time: (endTimestamp - startTimestamp)})
                             .subscribe(
                               () => {
                                 this.bottleService.reconnectListeners();
                               }
                             );
                         }
                       );
                     }
                   ).catch(
                     err => {
                       this.notificationService.error('Erreur durant le process d\'importation !' + err);
                       this.dismissLoading(loading);
                     }
                   );
                 }
      );
  }

  private dismissLoading(loading: Loading) {
    if (loading) {
      loading.dismiss();
    }
  }
}
