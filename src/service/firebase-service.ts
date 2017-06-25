import {AlertController, Loading, LoadingController, ToastController} from 'ionic-angular';
import {Observable} from 'rxjs/Observable';
import {LoginService} from './login.service';
/**
 * Created by loicsalou on 16.06.17.
 */

export abstract class FirebaseService {

  private USERS_FOLDER = 'users';
  private BOTTLES_FOLDER = 'bottles';
  private IMAGES_FOLDER = 'images';
  private XREF_FOLDER = 'xref';

  public BOTTLES_ROOT;
  public XREF_ROOT;
  public IMAGES_ROOT;

  private loading: Loading;

  constructor(private loadingCtrl: LoadingController, private alertController: AlertController,
              private toastController: ToastController, private loginService: LoginService) {
    loginService.authentifiedObservable.subscribe(user => this.initRoots(user));
  }

  initRoots(user) {
    if (user) {
      this.BOTTLES_ROOT = this.USERS_FOLDER + '/' + this.loginService.getUser() + '/' + this.BOTTLES_FOLDER;
      this.IMAGES_ROOT = this.IMAGES_FOLDER;
      this.XREF_ROOT = this.XREF_FOLDER;
    }
  }

  showLoading(message?: string) {
    if (this.loading == undefined) {
      this.loading = this.loadingCtrl.create({
                                               content: message ? message : 'Chargement en cours...',
                                               dismissOnPageChange: false
                                             });
      this.loading.present();
    }
  }

  dismissLoading() {
    if (this.loading != undefined) {
      this.loading.dismiss();
      this.loading = undefined;
    }
  }

  showInfo(message: string) {
    this.alertController.create({
                                  title: 'Information',
                                  subTitle: message,
                                  buttons: [ 'Ok' ]
                                }).present()

  }

  showToast(message: string) {
    this.toastController.create({
                                  message: message
                                }).present()
  }

  showAlert(message: string, err?: any) {
    this.alertController.create({
                                  title: 'Echec',
                                  subTitle: message + err,
                                  buttons: [ 'Ok' ]
                                }).present()

  }

  handleError(error: any, message?: string) {
    this.alertController.create({
                                  title: 'Erreur !',
                                  subTitle: message ? message + error : 'Une erreur s\'est produite ! ' + error,
                                  buttons: [ 'Ok' ]
                                })
    return Observable.throw(error.json().error || 'Database error');
  }

}
