/**
 * Created by loicsalou on 28.02.17.
 */
import {Injectable} from '@angular/core';
import {FilterSet} from '../distribution/distribution';
import {AngularFireDatabase} from 'angularfire2/database';
import {BottleFactory} from '../../model/bottle.factory';
import {AlertController, LoadingController} from 'ionic-angular';
import * as firebase from 'firebase/app';
import {LoginService} from './login.service';
import {Bottle} from '../model/bottle';
import {FirebaseService} from './firebase-service';
import {Observable} from 'rxjs/Observable';
import {Image} from '../model/image';
import Reference = firebase.database.Reference;

/**
 * Services related to the bottles in the cellar.
 * The subregion_label below are duplicated in the code of france.component.html as they are emitted when end-user
 * clicks on a region to filter bottles. Any change on either side must be propagated on the other side.
 */
@Injectable()
export class FirebaseImageService extends FirebaseService {

  private firebaseRef: Reference;

  constructor(private firebase: AngularFireDatabase, loadingCtrl: LoadingController,
              alertController: AlertController,
              private loginService: LoginService) {
    super(loadingCtrl, alertController);
    loginService.authentified.asObservable().subscribe(user => this.initFirebase());
  }

  initFirebase() {
    this.firebaseRef = this.firebase.database.ref(this.USERS_ROOT + '/' + this.loginService.getUser() + '/' + this.IMAGES_FOLDER);
  }

  public add(image: any, bottle: Bottle) {
    try {
      // Get a key for the image.
      let newKey = this.firebaseRef.push().key;

      // Write the new post's data simultaneously in the posts list and the user's post list.
      let updates = {};
      updates[ '/' + newKey ] = {
        bottleId: bottle[ '$key' ],
        image: image
      };
      //updates[ '/user-posts/' + uid + '/' + newKey ] = postData;

      return this.firebaseRef.update(updates);
      //this.firebaseRef.push(image);
    } catch (ex) {
      this.handleError(ex)
    }
  }

  /**
   * liste des images d'une bouteille
   * @param bottle
   */
  public getList(bottle: Bottle): Observable<Image[]> {
    let items = new Observable();
    if (!bottle) {
      return items;
    }
    this.showLoading();
    items = this.firebase.list(this.USERS_ROOT + '/' + this.loginService.getUser() + '/' + this.IMAGES_FOLDER, {
                                 query: {
                                   limitToFirst: 5,
                                   orderByChild: 'bottleId',
                                   equalTo: bottle[ '$key' ]
                                 }
                               }
    );
    items.subscribe(
      images => this.dismissLoading(),
      err => this.handleError(err)
    );
    return items;
  }

}


