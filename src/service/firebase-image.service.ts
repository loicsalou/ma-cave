/**
 * Created by loicsalou on 28.02.17.
 */
import {EventEmitter, Injectable} from '@angular/core';
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
import {Http} from '@angular/http';
import {File as CordovaFile} from '@ionic-native/file';
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
  public tracer: EventEmitter<string> = new EventEmitter();

  constructor(private angularFirebase: AngularFireDatabase, loadingCtrl: LoadingController,
              alertController: AlertController, toastController: ToastController, private filepath: FilePath,
              private loginService: LoginService, private http: Http, private file: CordovaFile) {
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
  public getImage(name: string): firebase.Promise<any> {
    return this.storageRef.child(name).getDownloadURL();
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
    this.storageRef.child(`${this.IMAGES_FOLDER}/${item.file[ 'name' ]}`)
      .delete()
      .then(function () {
              self.showToast('Image supprimée !')
            }
      )
      .catch(function (error) {
        self.showAlert('L\'image n\'a pas pu être supprimée ! ', error);
      });
  }

  trace(msg, obj) {
    this.tracer.emit(msg + ' ' + JSON.stringify(obj));
  }

  //fonctionne pour les navigateurs, mais pas pour Android malheureusement
  uploadImage(file: File) {
    this.trace('uploadImage start - ', file);
    let item: FileItem = new FileItem(file);
    this.showInfo('file item is:' + JSON.stringify(item));
    this.uploadImagesToFirebase([ item ]);
    this.trace('uploadImage end - ', item);
  }

  private saveImage(image: any) {
    let saveref = this.angularFirebase.database.ref(this.USERS_ROOT + '/' + this.loginService.getUser() + '/'
                                                    + this.IMAGES_FOLDER);

    saveref.push(image);
    this.showToast('l\'image ' + image.name + ' a bien été sauvegardée !');
  }

  uploadImagesToFirebase(files: FileItem[]) {
    _.each(files, (item: FileItem) => {
      this.trace('uploadImagesToFirebase loop start - ', item);
      item.isUploading = true;
      try {
        let uploadTask: firebase.storage.UploadTask = this.storageRef.child(item.file[ 'name' ]).put(item.file);
        this.trace('uploadImagesToFirebase uploadTask created - ', '');

        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
                      (snapshot) => {
                        item.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        this.trace('uploadImagesToFirebase progress - ', snapshot.bytesTransferred);
                      },
                      (error) => {
                        this.trace('uploadImagesToFirebase ERROR - ', error);
                        this.showAlert('uploadToFireBase planté !' + error);
                      },
                      () => {
                        this.trace('uploadImagesToFirebase complete - ', '');
                        item.url = uploadTask.snapshot.downloadURL;
                        item.isUploading = false;
                        this.trace('uploadImagesToFirebase before saveimage - ', '');
                        this.saveImage({name: item.file[ 'name' ], url: item.url});
                        this.trace('uploadImagesToFirebase after saveimage - ', '');

                      }
        );
      } catch (err) {
        this.trace('erreur !', err);
      }
    });
  }

  // code pour Android

  makeFileIntoBlob(_imagePath) {

    // INSTALL PLUGIN - cordova plugin add cordova-plugin-file
    return new Promise((resolve, reject) => {
      (<any>window).resolveLocalFileSystemURL(_imagePath, (fileEntry) => {

        fileEntry.file((resFile) => {

          var reader = new FileReader();
          reader.onloadend = (evt: any) => {
            var imgBlob: any = new Blob([ evt.target.result ], {type: 'image/jpeg'});
            imgBlob.name = 'sample.jpg';
            resolve(imgBlob);
          };

          reader.onerror = (e) => {
            console.log('Failed file read: ' + e.toString());
            reject(e);
          };

          reader.readAsArrayBuffer(resFile);
        });
      });
    });
  }

  uploadToFirebase(_imageBlob) {
    var fileName = 'sample-' + new Date().getTime() + '.jpg';

    return new Promise((resolve, reject) => {
      var fileRef = firebase.storage().ref('images/' + fileName);

      var uploadTask = fileRef.put(_imageBlob);

      uploadTask.on('state_changed', (_snapshot) => {
        console.log('snapshot progess ' + _snapshot);
      }, (_error) => {
        reject(_error);
      }, () => {
        // completion...
        resolve(uploadTask.snapshot);
      });
    });
  }

  saveToDatabaseAssetList(_uploadSnapshot) {
    var ref = firebase.database().ref('assets');

    return new Promise((resolve, reject) => {

      // we will save meta data of image in database
      var dataToSave = {
        'URL': _uploadSnapshot.downloadURL, // url to access file
        'name': _uploadSnapshot.metadata.name, // name of the file
        'owner': firebase.auth().currentUser.uid,
        'email': firebase.auth().currentUser.email,
        'lastUpdated': new Date().getTime(),
      };

      ref.push(dataToSave, (_response) => {
        resolve(_response);
      }).catch((_error) => {
        reject(_error);
      });
    });

  }

}


