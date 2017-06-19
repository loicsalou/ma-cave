/**
 * Created by loicsalou on 28.02.17.
 */
import {Injectable} from '@angular/core';
import {FilterSet} from '../distribution/distribution';
import {AngularFireDatabase} from 'angularfire2/database';
import {BottleFactory} from '../../model/bottle.factory';
import {AlertController, LoadingController, ToastController} from 'ionic-angular';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import {LoginService} from './login.service';
import {Bottle} from '../model/bottle';
import {FirebaseService} from './firebase-service';
import {Observable} from 'rxjs/Observable';
import {Image} from '../model/image';
import {FilePath} from '@ionic-native/file-path';
import {FileItem} from './file-item';
import * as _ from 'lodash';
import Reference = firebase.database.Reference;

//import { FirebaseApp } from 'angularfire2';

/**
 * Services related to the bottles in the cellar.
 * The subregion_label below are duplicated in the code of france.component.html as they are emitted when end-user
 * clicks on a region to filter bottles. Any change on either side must be propagated on the other side.
 */
@Injectable()
export class FirebaseImageService extends FirebaseService {

  private storageRef: firebase.storage.Reference;

  constructor(private angularFirebase: AngularFireDatabase, loadingCtrl: LoadingController,
              alertController: AlertController, toastController: ToastController, private filepath: FilePath,
              private loginService: LoginService) {
    super(loadingCtrl, alertController, toastController);
    if (loginService.user) {
      this.initFirebase();
    } else {
      try {
        loginService.authentified.subscribe(user => this.initFirebase());
      } catch (ex) {
        this.handleError(ex);
      }
    }
  }

  initFirebase() {
    this.storageRef = this.angularFirebase.app.storage().ref(this.USERS_ROOT + '/' + this.loginService.getUser() + '/' + this.IMAGES_FOLDER);
  }

  /**
   * liste des images d'une bouteille
   * @param bottle
   */
  public getImage(name: string): firebase.Promise<any>{
    return this.storageRef.child(this.IMAGES_FOLDER).child(name).getDownloadURL();
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
    items = this.angularFirebase.list(this.USERS_ROOT + '/' + this.loginService.getUser() + '/' + this.IMAGES_FOLDER, {
                                        query: {
                                          limitToFirst: 5,
                                          orderByChild: 'bottleId',
                                          equalTo: bottle[ '$key' ]
                                        }
                                      }
    );
    items.subscribe(
      (images: Image[]) => console.info(images.length + ' images reçues'),
      err => {
        this.handleError(err);
      }
    );
    return items;
  }

  deleteImage(file: File) {
    let item: FileItem = new FileItem(file);
    item.isUploading = true;
    let self = this;
    this.storageRef.child(`${this.IMAGES_FOLDER}/${item.file.name}`)
      .delete()
      .then(function () {
              self.showToast('Image supprimée !')
            }
      )
      .catch(function (error) {
        self.showAlert('L\'image n\'a pas pu être supprimée ! ', error);
      });
  }

  uploadImage(file: File) {
    let item: FileItem = new FileItem(file);
    this.uploadImagesToFirebase([ item ]);
  }

  uploadImagesToFirebase(files: FileItem[]) {
    _.each(files, (item: FileItem) => {

      item.isUploading = true;
      let uploadTask: firebase.storage.UploadTask = this.storageRef.child(`${this.IMAGES_FOLDER}/${item.file.name}`).put(item.file);

      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
                    (snapshot) => item.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
                    (error) => {
                    },
                    () => {
                      item.url = uploadTask.snapshot.downloadURL;
                      item.isUploading = false;
                      this.saveImage({name: item.file.name, url: item.url});
                    }
      );

    });

  }

  private saveImage(image: any) {
    let saveref = this.angularFirebase.database.ref(this.USERS_ROOT + '/' + this.loginService.getUser() + '/'
                                                    + this.IMAGES_FOLDER);

    saveref.push(image);
  }
}


