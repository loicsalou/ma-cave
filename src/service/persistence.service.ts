import {Loading, LoadingController} from 'ionic-angular';
import {Observable} from 'rxjs/Observable';
import {LoginService} from './login.service';
import {NotificationService} from './notification.service';
import {TranslateService} from '@ngx-translate/core';
/**
 * Created by loicsalou on 16.06.17.
 */

export abstract class PersistenceService {

  protected USERS_FOLDER = 'users';
  protected XREF_FOLDER = 'xref';

  public XREF_ROOT: string;

  private loading: Loading;

  constructor(private loadingCtrl: LoadingController, protected notificationService: NotificationService,
              protected loginService: LoginService, private translateService: TranslateService) {
    loginService.authentifiedObservable.subscribe(
      user => {
        if (loginService.user !== undefined) {
          this.initialize(loginService.user);
        } else {
          this.cleanup();
        }
      }
    );
  }

  protected initialize(user) {
    this.XREF_ROOT = this.XREF_FOLDER;
  }

  protected cleanup() {
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
