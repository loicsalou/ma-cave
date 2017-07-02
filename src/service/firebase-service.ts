import {Loading, LoadingController} from 'ionic-angular';
import {Observable} from 'rxjs/Observable';
import {LoginService} from './login.service';
import {NotificationService} from './notification.service';
import {TranslateService} from '@ngx-translate/core';
import {AngularFireDatabase} from 'angularfire2/database';
/**
 * Created by loicsalou on 16.06.17.
 */

export abstract class FirebaseService {

  private USERS_FOLDER = 'users';
  private BOTTLES_FOLDER = 'bottles';
  private IMAGES_FOLDER = 'images';
  private XREF_FOLDER = 'xref';

  public BOTTLES_ROOT: string;
  public XREF_ROOT: string;
  public IMAGES_ROOT: string;

  private loading: Loading;

  constructor(protected angularFirebase: AngularFireDatabase, private loadingCtrl: LoadingController, protected notificationService: NotificationService,
              private loginService: LoginService, private translateService: TranslateService) {
    loginService.authentifiedObservable.subscribe(
      user => {
        if (loginService.user !== undefined) {
          this.initialize(loginService.user);
        } else {
          this.cleanup();
        }
      }
    );
    if (loginService.user !== undefined) {
      this.initialize(loginService.user);
    } else {
      this.cleanup();
    }
  }

  protected initialize(user) {
      this.BOTTLES_ROOT = this.USERS_FOLDER + '/' + this.loginService.user.user + '/' + this.BOTTLES_FOLDER;
      this.IMAGES_ROOT = this.IMAGES_FOLDER;
      this.XREF_ROOT = this.XREF_FOLDER;
  }

  protected cleanup() {
    this.BOTTLES_ROOT = undefined;
    this.IMAGES_ROOT = undefined;
    this.XREF_ROOT = undefined;
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
