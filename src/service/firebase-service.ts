import {AlertController, Loading, LoadingController} from 'ionic-angular';
import {Observable} from 'rxjs/Observable';
/**
 * Created by loicsalou on 16.06.17.
 */

export abstract class FirebaseService {

  public USERS_ROOT = 'users';
  public BOTTLES_FOLDER = 'bottles';
  public IMAGES_FOLDER = 'images';

  private loading: Loading;

  constructor(private loadingCtrl: LoadingController, private alertController: AlertController) {
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

  showAlert(message: string, err: any) {
    this.alertController.create({
                                  title: 'Echec',
                                  subTitle: message + err,
                                  buttons: [ 'Ok' ]
                                }).present()

  }

  handleError(error: any) {
    this.alertController.create({
                                  title: 'Erreur !',
                                  subTitle: 'Une erreur s\'est produite ! ' + error,
                                  buttons: [ 'Ok' ]
                                })
    return Observable.throw(error.json().error || 'Database error');
  }

}
