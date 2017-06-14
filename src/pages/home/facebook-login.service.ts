/**
 * Created by loicsalou on 28.02.17.
 */
import {Injectable} from '@angular/core';
import {Bottle} from './bottle';
import {FilterSet} from '../distribution/distribution';
import {AlertController, Platform, ToastController} from 'ionic-angular';
import * as firebase from 'firebase/app';
import {LoginService} from './login.service';
import {Facebook} from '@ionic-native/facebook';
import Reference = firebase.database.Reference;

/**
 * Services related to the bottles in the cellar.
 * The subregion_label below are duplicated in the code of france.component.html as they are emitted when end-user
 * clicks on a region to filter bottles. Any change on either side must be propagated on the other side.
 */
@Injectable()
export class FacebookLoginService extends LoginService {
  private _authenticated: boolean;
  error: Error;
  private provider: firebase.auth.FacebookAuthProvider;
  private facebookToken;
  private user: any;

  constructor(private alertCtrl: AlertController, private toastCtrl: ToastController, private platform: Platform, private facebook: Facebook) {
    super();
  }

  public login() {
    this.provider = new firebase.auth.FacebookAuthProvider();
    //this.provider.addScope('user_birthday');
    let self = this;
    //firebase.auth().signInWithPopup(this.provider).then(function (result) {
    this.facebook.login([ 'email' ]).then(function (result) {
      const fc = this.provider.auth.FacebookAuthProvider.credential(result.authResponse.accessToken);
      // The signed-in user info.
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      //self.facebookToken = result.credential.accessToken;
      self.user = result.authResponse.userID;
      this.provider.auth().signinWithCredential(fc).then(fs => this.toastMessage('login successful'+self.user))
        .catch(fberr => this.loginError(fberr));
      self._authenticated = true;
      // ...
    }).catch(error => {
      // Handle Errors here.
      //var errorCode = error.code;
      let errorMessage = error.message;
      self.alertCtrl.create().present()
      // The email of the user's account used.
      //var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      //var credential = error.credential;
      // ...
    });
  }

  public getCellarExplorerUserId(): string {
    return this.user === undefined ? undefined : this.user[ 'uid' ];
  }

  get authenticated(): boolean {
    return this.user !== undefined;
  }

  private toastMessage(text) {
    this.toastCtrl.create(
      {
        message: text,
        cssClass: 'success-message',
        showCloseButton: true
      }).present();
  }

  private loginError(err) {
    return {
      title: 'Echec',
      subTitle: 'l\'authentification a échoué: ' + err,
      buttons: [ 'Ok' ]
    }
  }
}


