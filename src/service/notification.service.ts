import {AlertController, Loading, LoadingController, ToastController} from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

/**
 * Created by loicsalou on 13.06.17.
 */
export class NotificationService {
  private _debugMode: boolean = false;

  constructor(private alertController: AlertController, private toastController: ToastController,
              private translateService: TranslateService, private loadingCtrl: LoadingController) {
  }

  set debugMode(value: boolean) {
    this._debugMode = value;
  }

  information(message: string, showCloseButton?: boolean, delay?: number, position?: string) {
    let msg = this.translateService.instant(message);
    this.toastController.create({
                                  message: msg,
                                  duration: delay ? delay : 3000,
                                  position: position ? position : 'top',
                                  showCloseButton: showCloseButton ? showCloseButton : false
                                })
      .present()
  }

  error(message: string, error?: any) {
    this.alertController.create({
                                  title: this.translateService.instant('app.error'),
                                  subTitle: message ? message + error : 'Une erreur s\'est produite ! ' + error ? error : '',
                                  buttons: [ 'Ok' ]
                                })
      .present();
  }

  failed(message: string, error?: any) {
    this.alertController.create({
                                  title: this.translateService.instant('app.failed'),
                                  subTitle: message ? message + error : 'l\'opération a échoué' + error ? error : '',
                                  buttons: [ 'Ok' ]
                                })
      .present();
  }

  i18nFailed(message: string) {
    this.alertController.create({
                                  title: this.translateService.instant('app.failed'),
                                  subTitle: this.translateService.instant(message),
                                  buttons: [ 'Ok' ]
                                })
      .present();
  }

  warning(message: string, error?: any) {
    this.alertController.create({
                                  title: this.translateService.instant('app.warning'),
                                  subTitle: message + (error ? error : ''),
                                  buttons: [ 'Ok' ]
                                })
      .present();
  }

  debugAlert(message: string, obj?: any) {
    if (this._debugMode) {
      alert(message + ' ' + (obj ? JSON.stringify(obj) : '-'));
    } else {
      console.debug(message + (obj ? obj : ''));
    }
  }

  ask(title: string, message: string,): Observable<boolean> {
    let response: Subject<boolean> = new Subject();
    let alert = this.alertController.create({
                                              title: title,
                                              message: message,
                                              buttons: [
                                                {
                                                  text: 'Non',
                                                  role: 'cancel',
                                                  handler: () => response.next(false)
                                                },
                                                {
                                                  text: 'Oui',
                                                  handler: () => response.next(true)
                                                }
                                              ]
                                            });
    alert.present();
    return response.asObservable();
  }

  createLoadingPopup(messageKey: string): Loading {
    let popup: Loading = this.loadingCtrl.create({
                                                   content: this.translateService.instant(messageKey),
                                                   dismissOnPageChange: false
                                                 });
    popup.present();
    return popup;
  }

  traceInfo(trace: string) {
    // à remplacer par un log si nécessaire
    console.info(trace);
  }

  traceDebug(trace: string) {
    // à remplacer par un log si nécessaire
    console.debug(trace);
  }

  traceWarn(trace: string) {
    // à remplacer par un log si nécessaire
    console.warn(trace);
  }
}
