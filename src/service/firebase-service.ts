import {AlertController, Loading, LoadingController, ToastController} from 'ionic-angular';
import {Observable} from 'rxjs/Observable';
import {LoginService} from './login.service';
import {NotificationService} from './notification.service';
import {TranslateService} from '@ngx-translate/core';
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

  constructor(private loadingCtrl: LoadingController, protected notificationService: NotificationService,
              private loginService: LoginService, private translateService: TranslateService) {
    loginService.authentifiedObservable.subscribe(user => this.initRoots(user));
  }

  initRoots(user) {
    if (user) {
      this.BOTTLES_ROOT = this.USERS_FOLDER + '/' + this.loginService.user.getUser() + '/' + this.BOTTLES_FOLDER;
      this.IMAGES_ROOT = this.IMAGES_FOLDER;
      this.XREF_ROOT = this.XREF_FOLDER;
    }
  }

  showLoading(message?: string) {
    if (this.loading == undefined) {
      this.loading = this.loadingCtrl.create({
                                               content: message ? message : this.translateService.instant('loading'),
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

  protected handleError(message: string, error: any) {
    this.notificationService.error(message, error);
    return Observable.throw(error.json().error || 'Firebase error');
  }

}
