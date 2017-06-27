/**
 * Created by loicsalou on 28.02.17.
 */
import {Injectable} from '@angular/core';
import {Bottle} from './bottle';
import {FilterSet} from '../distribution/distribution';
import {AlertController, Platform, ToastController} from 'ionic-angular';
import * as firebase from 'firebase/app';
import {AbstractLoginService} from './abstract-login.service';
import {Facebook} from '@ionic-native/facebook';
import {User} from '../model/user';
import {Observable} from 'rxjs/Observable';
import Reference = firebase.database.Reference;

/**
 * Services related to the bottles in the cellar.
 * The subregion_label below are duplicated in the code of france.component.html as they are emitted when end-user
 * clicks on a region to filter bottles. Any change on either side must be propagated on the other side.
 */
@Injectable()
export class FacebookLoginService extends AbstractLoginService {
  private provider: firebase.auth.FacebookAuthProvider;

  constructor(private alertCtrl: AlertController, private toastCtrl: ToastController, private platform: Platform, private facebook: Facebook) {
    super();
  }

  public login(): Observable<User> {
    this.facebook.login([ 'email' ]).then((response) => {
      const facebookCredential = firebase.auth.FacebookAuthProvider
        .credential(response.authResponse.accessToken);

      firebase.auth().signInWithCredential(facebookCredential)
        .then((success) => {
          let user = new FacebookUser(success.user, success.email, success.photoURL);
          this.toastMessage('Succès ! ' + JSON.stringify(user));
          this.success(user);
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

    return this.authentifiedObservable;
  }

  private toastMessage(text) {
    this.toastCtrl.create(
      {
        message: text,
        cssClass: 'success-message',
        duration: 3000
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

export class FacebookUser implements User {
  user: string;
  email: string;
  photoURL: string;

  constructor(user: string, email: string, photoURL: string) {
    this.user = user;
    this.email = email;
    this.photoURL = photoURL;
  }

  getUser(): string {
    return this.user;
  }

  getEmail(): string {
    return this.email;
  }

  getPhotoURL(): string {
    return this.photoURL;
  }
}
