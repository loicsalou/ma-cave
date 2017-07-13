import {AlertController, Loading, LoadingController, ToastController} from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

/**
 * Created by loicsalou on 13.06.17.
 */
export class NotificationService {

  constructor(private alertController: AlertController, private toastController: ToastController,
              private translateService: TranslateService, private loadingCtrl: LoadingController) {
  }

  information(message: string, delay?: number, position?: string) {
    this.toastController.create({
                                  message: message,
                                  duration: delay ? delay : 3000,
                                  position: position ? position : 'top'
                                })
      .present()
  }

  error(message: string, error?: any) {
    this.alertController.create({
                                  title: this.translateService.instant('error'),
                                  subTitle: message ? message + error : 'Une erreur s\'est produite ! ' + error ? error : '',
                                  buttons: [ 'Ok' ]
                                })
      .present();
  }

  failed(message: string, error?: any) {
    this.alertController.create({
                                  title: this.translateService.instant('failed'),
                                  subTitle: message ? message + error : 'l\'opération a échoué' + error ? error : '',
                                  buttons: [ 'Ok' ]
                                })
      .present();
  }

  warning(message: string, error?: any) {
    this.alertController.create({
                                  title: this.translateService.instant('warning'),
                                  subTitle: message + (error ? error : ''),
                                  buttons: [ 'Ok' ]
                                })
      .present();
  }

  debugAlert(message: string, obj?: any, debug: boolean = false) {
    if (debug) {
      alert(message + ' ' + (obj ? JSON.stringify(obj) : '-'));
    } else {

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
