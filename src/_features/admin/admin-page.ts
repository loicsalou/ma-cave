import {Component} from '@angular/core';
import {BottlePersistenceService} from '../../service/bottle-persistence.service';
import {NotificationService} from '../../service/notification.service';
import {ImportProvider} from '../../providers/import/import';
import {ApplicationState} from '../../app/state/app.state';
import {Store} from '@ngrx/store';
import {BottlesQuery} from '../../app/state/bottles.state';
import {DeleteAccountAction, LogoutAction} from '../../app/state/shared.actions';
import {SharedQuery} from '../../app/state/shared.state';
import {Observable} from 'rxjs';
import {User} from '../../model/user';
import {take} from 'rxjs/operators';
import {LoadingController, Platform} from '@ionic/angular';



/**
 * Generated class for the UploadBottles page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
             templateUrl: 'admin-page.html'
           })
export class AdminPage {
  from: number = 0;
  nbRead: number = 999;
  encoding: string; // forcer l'encoding
  optionsVisibles: boolean = false; // forcer l'encoding
  deleteBefore: boolean = true;
  localStorageKeys: any;
  tempValue: any;
  private user$: Observable<User>;

  constructor(private notificationService: NotificationService,
              private bottleService: BottlePersistenceService,
              private platform: Platform,
              private loadingController: LoadingController,
              private importProvider: ImportProvider,
              private store: Store<ApplicationState>) {
    this.user$ = this.store.select(SharedQuery.getLoginUser);
  }

  deleteAccount() {
    this.notificationService.ask('question', 'app.confirm').pipe(take(1)).subscribe(
      result => {
        if (result) {
          this.store.dispatch(new DeleteAccountAction());
        }
      }
    );
  }

  logout() {
    this.store.dispatch(new LogoutAction());
    //this.navCtrl.setRoot(HomePage);
    //this.navCtrl.popToRoot();
    //setTimeout(() => {
    //             window.history.pushState({}, '', '/');
    //             //window.location.reload();
    //           }
    //  , 100);
  }

  public switchAdvancedOptions() {
    this.optionsVisibles = !this.optionsVisibles;
  }

  public readBrowserFile(event: any) {
    //let textType = /text.*/;
    let file = event.currentTarget.files[ 0 ];
    this.setupUpload(file);
  }

  public emptyLockers() {
    //this.bottleService.allBottlesObservable.take(1).subscribe(
    this.store.select(BottlesQuery.getBottles).pipe(take(1)).subscribe(
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

  private setupUpload(file: any) {
    if (this.deleteBefore) {
      this.bottleService.deleteBottles();
    }
    this.bottleService.disconnectListeners();
    this.loadingController.create({
                                    spinner: 'bubbles',
                                    content: 'Importation en cours...'
                                  })
      .then((loading: HTMLIonLoadingElement) => {
        loading.present().then(
          () => {
            try {
              this.processParsing(loading, file);
            } catch (err) {
              this.notificationService.error('Erreur durant le process d\'importation !' + err);
              this.dismissLoading(loading);
            }
          }
        );
      });
  }

  private processParsing(loading: HTMLIonLoadingElement, file: File) {
    let parsedBottles = [];
    let startTimestamp = new Date().getTime();
    this.importProvider.parseFile(file).pipe(
      take(1)
    ).subscribe(
      bottle => {
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
        this.loadingController.create({
                                        spinner: 'bubbles',
                                        content: 'Sauvegarde de ' + parsedBottles.length + ' lots : '
                                      })
          .then(loading => {
            loading.present().then(
              () => {
                this.bottleService.save(parsedBottles).pipe(take(1)).subscribe(
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
          });
      });
  }

  private dismissLoading(loading: HTMLIonLoadingElement) {
    if (loading) {
      loading.dismiss();
    }
  }
}
