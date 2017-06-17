/**
 * Created by loicsalou on 28.02.17.
 */
import {Injectable} from '@angular/core';
import {Bottle} from './bottle';
import {FilterSet} from '../distribution/distribution';
import {AngularFireAuth} from 'angularfire2/auth';
import {AlertController} from 'ionic-angular';
import * as firebase from 'firebase/app';
import {LoginService} from './login.service';
import Reference = firebase.database.Reference;

/**
 * Services related to the bottles in the cellar.
 * The subregion_label below are duplicated in the code of france.component.html as they are emitted when end-user
 * clicks on a region to filter bottles. Any change on either side must be propagated on the other side.
 */
@Injectable()
export class AnonymousLoginService extends LoginService {

  constructor(private alertCtrl: AlertController, private firebaseAuth: AngularFireAuth) {
    super();
  }

  public login() {
    this.firebaseAuth.auth.signInAnonymously()
      .then(
        () => this.success('businesssalou@gmailcom')
      )
  }
}


