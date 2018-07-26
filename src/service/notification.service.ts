import {AlertController, Loading, LoadingController, ToastController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {from, Observable, Subject} from 'rxjs';
import {logDebug} from '../utils';

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
      .then(toast => toast.present());
  }

  error(message: string, error?: any) {
    let msg = this.translateService.instant(message);
    this.alertController.create({
                                  header: this.translateService.instant('app.error'),
                                  subHeader: msg + (error ? error : ''),
                                  buttons: [ 'Ok' ]
                                })
      .then(alt => alt.present());
  }

  failed(message: string, error?: any) {
    let msg = this.translateService.instant(message);
    this.alertController.create({
                                  header: this.translateService.instant('app.failed'),
                                  subHeader: msg + (error ? error : ''),
                                  buttons: [ 'Ok' ]
                                })
      .then(alt => alt.present());
  }

  warning(message: string, error?: any) {
    let msg = this.translateService.instant(message);
    this.alertController.create({
                                  header: this.translateService.instant('app.warning'),
                                  subHeader: msg + (error ? error : ''),
                                  buttons: [ 'Ok' ]
                                })
      .then(alt => alt.present());
  }

  debugAlert(message: string, obj?: any) {
    if (this._debugMode) {
      alert(message + ' ' + (obj ? JSON.stringify(obj) : '-'));
    } else {
      logDebug(message + (obj ? obj : ''));
    }
  }

  ask(title: string, message: string): Observable<boolean> {
    title = this.translateService.instant(title);
    message = this.translateService.instant(message);

    let response: Subject<boolean> = new Subject();
    this.alertController.create({
                                  header: title,
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
                                })
      .then(alt => alt.present());
    return response.asObservable();
  }

  askNoChoice(title: string, message: string, params?: Object): Observable<boolean> {
    title = this.translateService.instant(title);
    message = this.translateService.instant(message, params);

    let response: Subject<boolean> = new Subject();
    let alert = this.alertController.create({
                                              header: title,
                                              message: message,
                                              buttons: [
                                                {
                                                  text: 'Ok',
                                                  handler: () => response.next(true)
                                                }
                                              ]
                                            });
    alert.present();
    return response.asObservable();
  }

  createLoadingPopup(messageKey: string): Observable<Loading> {
    return from(this.loadingCtrl.create({
                                          content: this.translateService.instant(messageKey),
                                          dismissOnPageChange: false
                                        }));
  }

  receiving(s: string) {
// voir si on peut afficher un signal visuel discret
  }

  notImplementedInMock(func: string) {
    this.warning(`Fonction non disponible en mode mock: ${func}`);
  }
}
