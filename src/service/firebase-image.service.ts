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
import {Bottle, BottleMetadata} from '../model/bottle';
import {FirebaseService} from './firebase-service';
import {Observable} from 'rxjs/Observable';
import {Image} from '../model/image';
import {FileItem} from './file-item';
import {File as CordovaFile} from '@ionic-native/file';
import Reference = firebase.database.Reference;
import UploadTaskSnapshot = firebase.storage.UploadTaskSnapshot;

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
              alertController: AlertController, toastController: ToastController, private file: CordovaFile,
              loginService: LoginService) {
    super(loadingCtrl, alertController, toastController, loginService);
    loginService.authentifiedObservable.subscribe(user => this.initFirebase(user));
  }

  initFirebase(user) {
    if (user) {
      this.storageRef = this.angularFirebase.app.storage().ref(this.IMAGES_ROOT);
    }
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
    items = this.angularFirebase.list(this.XREF_ROOT, {
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

  public deleteImage(file: File) {
    let item: FileItem = new FileItem(file);
    item.isUploading = true;
    let self = this;
    this.storageRef.child(`${this.IMAGES_ROOT}/${item.file[ 'name' ]}`)
      .delete()
      .then(function () {
              self.showToast('Image supprimée !')
            }
      )
      .catch(function (error) {
        self.showAlert('L\'image n\'a pas pu être supprimée ! ', error);
      });
  }

  /**
   * upload a picture and push to firebase
   * @param image either an image (instanceof File) or an image on a mobile phone (actually something like an URI
   * that must be translated to Blob before being uploaded)
   * @param meta metadata to be attached to the image in Firebase
   */
  public uploadImage(image: File | any, meta: BottleMetadata): Promise<UploadMetadata> {
    if (image instanceof Blob || image instanceof File) {
      return this.uploadFileOrBlob(image, meta)
    } else {
      this.showAlert('impossible d\'uploader l\'image dont le type est '+typeof image+' !');
    }
  }

  private uploadFileOrBlob(fileOrBlob, meta: BottleMetadata): Promise<UploadMetadata> {
    return this.uploadToFirebase(fileOrBlob, meta.nomCru)
      .then((uploadSnapshot: any) => {
        //file uploaded successfully URL= uploadSnapshot.downloadURL
        // store reference to storage in database
        return this.saveToDatabaseAssetList(uploadSnapshot, meta);
      }, (error) => {
        this.showAlert('Error during push to firebase of the picture', error);
      });
  }

  public createBlobFromPath(imagePath): Promise<Blob> {
    // REQUIRED PLUGIN - cordova plugin add cordova-plugin-file
    return new Promise((resolve, reject) => {
      (<any>window).resolveLocalFileSystemURL(imagePath, (fileEntry) => {

        fileEntry.file((resFile) => {

          let reader = new FileReader();
          reader.onloadend = (evt: any) => {
            let imgBlob: any = new Blob([ evt.target.result ], {type: 'image/jpeg'});
            imgBlob.name = 'blob.jpg';
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

  private uploadToFirebase(imageBlob, name: string): Promise<UploadTaskSnapshot> {
    let fileName = name + '-' + new Date().getTime() + '.jpg';

    return new Promise((resolve, reject) => {

      let fileRef = this.storageRef.child(fileName);
      let uploadTask = fileRef.put(imageBlob);

      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
                    (snapshot) => {
                      //item.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    },
                    (error) => {
                      reject(error);
                    },
                    () => {
                      resolve(uploadTask.snapshot);
                    })
    });
  }

  private saveToDatabaseAssetList(uploadSnapshot, meta: BottleMetadata): Promise<UploadMetadata> {
    let ref = firebase.database().ref('assets/images');

    return new Promise((resolve, reject) => {

      // we will save meta data of image in database
      let dataToSave = {
        'URL': uploadSnapshot.downloadURL, // url to access file
        'name': uploadSnapshot.metadata.name, // name of the file
        'owner': firebase.auth().currentUser.uid,
        'email': firebase.auth().currentUser.email,
        'lastUpdated': new Date().getTime(),
        'keywords': meta.keywords,
        'subregion_label': meta.subregion_label,
        'area_label': meta.area_label,
        'nomCru': meta.nomCru,
      };

      ref.push(dataToSave, (response) => {
        //la réponse est null, donc on renvoie ce qui nous intéresse
        resolve(this.getUploadMeta(uploadSnapshot));
      }).catch((_error) => {
        reject(_error);
      });
    });
  }

  private getUploadMeta(snap): UploadMetadata {
    return {
      downloadURL: snap.downloadURL,
      imageName: snap.metadata.name,
      contentType: snap.metadata.contentType,
      totalBytes: snap.totalBytes,
      updated: snap.metadata.updated,
      timeCreated: snap.metadata.timeCreated,
      uploadState: snap.state
    }
  }
}

export interface UploadMetadata {
  downloadURL: string;
  imageName: string;
  contentType: string;
  totalBytes: number;
  updated: string;
  timeCreated: string;
  uploadState: string;
}
