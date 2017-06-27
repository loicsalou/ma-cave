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
import {AbstractLoginService} from './abstract-login.service';
import {User} from '../model/user';
import {Observable} from 'rxjs/Observable';
import Reference = firebase.database.Reference;

/**
 * Services related to the bottles in the cellar.
 * The subregion_label below are duplicated in the code of france.component.html as they are emitted when end-user
 * clicks on a region to filter bottles. Any change on either side must be propagated on the other side.
 */
@Injectable()
export class EmailLoginService extends AbstractLoginService {

  private _username: string;
  private _psw: string;

  private firebaseRef: firebase.database.Reference;

  constructor(private alertCtrl: AlertController, private firebaseAuth: AngularFireAuth, private platform: Platform,
              private firebase: AngularFireDatabase, private alertController: AlertController) {
    super();
    this.firebaseRef = this.firebase.database.ref('users/');
  }

  get username(): string {
    return this._username;
  }

  set username(value: string) {
    this._username = value;
  }

  get psw(): string {
    return this._psw;
  }

  set psw(value: string) {
    this._psw = value;
  }

  public login(): Observable<User> {
    let self = this;
    firebase.auth().signInWithEmailAndPassword(this.username, this.psw)
      .then(
        token => {
          self.success(new EmailLoginUser(this.username, this.psw, null));
        }
      )
      .catch(function (error) {
        firebase.auth().createUserWithEmailAndPassword(self.user.getUser(), self.psw)
          .then(() => self.success(self.user))
          .catch(function (error2) {
            self.loginError(error);
          });
        self.loginError(error);
      });

    return this.authentifiedObservable;
  }

  private loginError(err) {
    this.alertCtrl.create({
                            title: 'Echec',
                            subTitle: 'l\'authentification a échoué: ' + err,
                            buttons: [ 'Ok' ]
                          }).present();
  }
}

export class EmailLoginUser implements User {
  private user: string;
  private email: string;
  private photoURL: string;

  constructor(user: string, email: string, photoUrl: string) {
    this.user = user.replace(/[\.]/g, '');
    this.user = this.user.replace(/[#.]/g, '');
    this.email = email;
    this.photoURL = photoUrl;
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


