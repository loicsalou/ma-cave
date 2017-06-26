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
  private provider: firebase.auth.FacebookAuthProvider;
  private facebookToken;

  constructor(private alertCtrl: AlertController, private toastCtrl: ToastController, private platform: Platform, private facebook: Facebook) {
    super();
  }

  public login() {
    this.facebook.login([ 'email' ]).then((response) => {
      const facebookCredential = firebase.auth.FacebookAuthProvider
        .credential(response.authResponse.accessToken);

      firebase.auth().signInWithCredential(facebookCredential)
        .then((success) => {
          this.alertCtrl.create({
                                  title: 'Succès !',
                                  subTitle: 'Firebase success: ' + JSON.stringify(success),
                                  buttons: [ 'Ok' ]
                                }).present();
        })
        .catch((error) => {
          this.alertCtrl.create({
                                  title: 'Echec',
                                  subTitle: 'Firebase failure: ' + JSON.stringify(error),
                                  buttons: [ 'Ok' ]
                                }).present();
        });

    }).catch((error) => {
      this.alertCtrl.create({
                              title: 'Echec',
                              subTitle: 'l\'authentification a échoué: ' + error,
                              buttons: [ 'Ok' ]
                            }).present();
    });
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
