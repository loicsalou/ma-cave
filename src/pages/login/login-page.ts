/**
 * Created by loicsalou on 16.06.17.
 */
import {LoginService} from '../../service/login.service';
import {AlertController} from 'ionic-angular';

export abstract class LoginPage {

  user: string;
  psw: string;

  constructor(public loginService: LoginService, public alertController: AlertController) {
    this.loginService.authentified.subscribe(
      user => this.authenticated(user),
      error => this.authError(error)
    )
  }

  abstract signin();

  abstract authenticated(user: any);

  private authError(err: any) {
    this.alertController.create({
                                  title: 'Echec',
                                  subTitle: 'L\'authentification a échoué ! ' + err,
                                  buttons: [ 'Ok' ]
                                }).present()
  }
}
