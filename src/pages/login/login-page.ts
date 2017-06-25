/**
 * Created by loicsalou on 16.06.17.
 */
import {LoginService} from '../../service/login.service';
import {AlertController} from 'ionic-angular';
import {Subscription} from 'rxjs/Subscription';

export abstract class LoginPage {

  authSubscription: Subscription;

  user: string;
  psw: string;

  constructor(public loginService: LoginService, public alertController: AlertController) {
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

  private authError(err: any) {
    this.alertController.create({
                                  title: 'Echec',
                                  subTitle: 'L\'authentification a échoué ! ' + err,
                                  buttons: [ 'Ok' ]
                                }).present()
  }
}
