/**
 * Created by loicsalou on 16.06.17.
 */
import {LoginService} from '../../service/login.service';
import {Subscription} from 'rxjs/Subscription';
import {NotificationService} from '../../service/notification.service';

export abstract class LoginPage {

  authSubscription: Subscription;

  user: string;
  psw: string;

  constructor(public loginService: LoginService, protected notificationService: NotificationService) {
    this.authSubscription = this.loginService.authentifiedObservable.subscribe(
      user => this.authenticated(user),
      error => this.authError(error)
    )
  }

  abstract signin();

  public authenticated(user: any) {
    if (user) {
      //beware of initial value (undefined)
      this.authSubscription.unsubscribe();
    }
  }

  private authError(error: any) {
    this.notificationService.failed('L\'authentification a échoué ! ', error)
  }
}
