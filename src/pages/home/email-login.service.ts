/**
 * Created by loicsalou on 28.02.17.
 */
import {Injectable} from '@angular/core';
import {Bottle} from './bottle';
import {FilterSet} from '../distribution/distribution';
import {AngularFireAuth} from 'angularfire2/auth';
import {AlertController, Platform} from 'ionic-angular';
import * as firebase from 'firebase/app';
import {AngularFireDatabase} from 'angularfire2/database';
import {LoginService} from './login.service';
import Reference = firebase.database.Reference;

/**
 * Services related to the bottles in the cellar.
 * The subregion_label below are duplicated in the code of france.component.html as they are emitted when end-user
 * clicks on a region to filter bottles. Any change on either side must be propagated on the other side.
 */
@Injectable()
export class EmailLoginService extends LoginService {

  private _authenticated: boolean;
  error: Error;
  private firebaseRef: firebase.database.Reference;

  constructor(private alertCtrl: AlertController, private firebaseAuth: AngularFireAuth, private platform: Platform,
              private firebase: AngularFireDatabase, private alertController: AlertController) {
    super();
    this.firebaseRef = this.firebase.database.ref('users/');
  }

  public login() {
    let self = this;
    firebase.auth().signInWithEmailAndPassword(this.user, this.psw)
      .then(() => self.success(self.user))
      .catch(function (error) {
        firebase.auth().createUserWithEmailAndPassword(self.user, self.psw)
          .then(() => self.success(self.user))
          .catch(function (error2) {
            self.loginError(error);
          });
        self.loginError(error);
      });
  }

  public success(user: string): any {
    user = user.replace(/[\.]/g, '');
    user = user.replace(/[#.]/g, '');
    let psw = undefined;

    return super.success(user);
  }

  private loginError(err) {
    this.alertCtrl.create({
                            title: 'Echec',
                            subTitle: 'l\'authentification a échoué: ' + err,
                            buttons: [ 'Ok' ]
                          }).present();
  }
}


