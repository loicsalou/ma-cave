/**
 * Created by loicsalou on 28.02.17.
 */
import {Injectable} from '@angular/core';
import {Bottle} from './bottle';
import {FilterSet} from '../distribution/distribution';
import {AngularFireAuth} from 'angularfire2/auth';
import {AlertController, Platform} from 'ionic-angular';
import * as firebase from 'firebase/app';
import Reference = firebase.database.Reference;

/**
 * Services related to the bottles in the cellar.
 * The subregion_label below are duplicated in the code of france.component.html as they are emitted when end-user
 * clicks on a region to filter bottles. Any change on either side must be propagated on the other side.
 */
@Injectable()
export class LoginService {
  private _authenticated: boolean;
  error: Error;

  constructor(private alertCtrl: AlertController, private firebaseAuth: AngularFireAuth, private platform: Platform) {
  }

  public login() {
    this.firebaseAuth.auth.signInAnonymously()
      .then(
        () => this._authenticated = true
      )
      .catch(
        (a: Error) => this.error=a
          //this.alertCtrl.create(this.loginError(a)).present()).then(() => this.platform.exitApp()
    );
  }

  get authenticated(): boolean {
    return this._authenticated;
  }

  private loginError(err) {
    return {
      title: 'Echec',
      subTitle: 'l\'authentification a échoué: ' + err,
      buttons: [ 'Ok' ]
    }
  }
}


