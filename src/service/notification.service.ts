import {User} from '../model/user';
import {AlertController, ToastController} from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
/**
 * Created by loicsalou on 13.06.17.
 */
export class NotificationService {
  private _user: User;

  constructor(private alertController: AlertController, private toastController: ToastController, private translateService: TranslateService) {
  }

  information(message: string, delay?: number, position?: string) {
    this.toastController.create({
                                  message: message,
                                  duration: delay ? delay : 3000,
                                  position: position ? position : 'top'
                                }).present()
  }

  error(message: string, error?: any) {
    this.alertController.create({
                                  title: this.translateService.instant('error'),
                                  subTitle: message ? message + error : 'Une erreur s\'est produite ! ' + error,
                                  buttons: [ 'Ok' ]
                                })
  }

  failed(message: string, error?: any) {
    this.alertController.create({
                                  title: this.translateService.instant('failed'),
                                  subTitle: message ? message + error : 'l\'opération a échoué' + error,
                                  buttons: [ 'Ok' ]
                                })
  }

  warning(message: string, error?: any) {
    this.alertController.create({
                                  title: this.translateService.instant('warning'),
                                  subTitle: message ? message + error : error,
                                  buttons: [ 'Ok' ]
                                })
  }

  ask(title: string, message: string, ): Observable<boolean> {
    let choice: boolean;
    let response: Subject<boolean>=new Subject();
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

  traceInfo(trace: string) {
    // à remplacer par un log si nécessaire
    console.info(trace);
  }

  traceWarn(trace: string) {
    // à remplacer par un log si nécessaire
    console.warn(trace);
  }
}
