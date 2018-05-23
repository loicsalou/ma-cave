/**
 * Created by loicsalou on 28.02.17.
 */
import * as firebase from 'firebase/app';
import * as moment from 'moment';
import * as schema from './firebase-schema';

import {Injectable} from '@angular/core';
import {Bottle, BottleMetadata} from '../../model/bottle';
import {Observable, Subject} from 'rxjs';
import {AngularFireDatabase} from 'angularfire2/database';
import {Image} from '../../model/image';
import {FileItem} from '../../model/file-item';
import {UploadMetadata} from '../image-persistence.service';
import {NotificationService} from '../notification.service';
import {User} from '../../model/user';
import {Reference as FbStorageTypesReference} from '@firebase/storage-types';
import Reference = firebase.database.Reference;
import UploadTaskSnapshot = firebase.storage.UploadTaskSnapshot;

/**
 * Services related to the images in the cellar.
 */
@Injectable()
export class FirebaseImagesService {
  public XREF_ROOT: string;
  public IMAGES_ROOT: string;
  private xRefRootRef: Reference;
  private imageStorageRef: FbStorageTypesReference;

  private ERROR_ROOT: string;
  private errorRootRef: Reference;

  private _uploadProgressEvent: Subject<number> = new Subject<number>();

  constructor(private angularFirebase: AngularFireDatabase,
              private notificationService: NotificationService) {
  }

  private static getUploadImageMeta(snap): UploadMetadata {
    return {
      downloadURL: snap.downloadURL,
      imageName: snap.metadata.name,
      contentType: snap.metadata.contentType,
      totalBytes: snap.totalBytes,
      updated: snap.metadata.updated,
      timeCreated: snap.metadata.timeCreated,
      uploadState: snap.state
    };
  }

  public initialize(user: User) {
    let userRoot = user.user;

    this.IMAGES_ROOT = schema.IMAGES_FOLDER;
    this.imageStorageRef = this.angularFirebase.database.app.storage().ref(this.IMAGES_ROOT);

    this.XREF_ROOT = schema.XREF_FOLDER;
    this.xRefRootRef = firebase.database().ref(this.XREF_ROOT);

    this.ERROR_ROOT = schema.USERS_FOLDER + '/' + userRoot + '/' + schema.ERROR_CONTENT_FOLDER;
    this.errorRootRef = this.angularFirebase.database.ref(this.ERROR_ROOT);

    this.initLogging();
  }

  // ===================================================== ERRORS

  public cleanup() {
    this.IMAGES_ROOT = undefined;
    this.imageStorageRef = undefined;
  }

  public logError(err: any) {
    try {
      err = err ? err : 'rien dans erreur';
      let logged = '';
      if (err instanceof Error) {
        logged = err.toString();
      } else {
        logged = err.toString() + ' / ' + JSON.stringify(err);
      }
      this.errorRootRef.push({date: moment().format('YYYY-MM-DD HH:mm:ss'), error: logged});
    } catch (errorInError) {
    }
  }

  //============================= Image management
  /**
   * suivi de la progression des uploads.
   * @returns {Observable<number>}
   */
  progress(): Observable<number> {
    return this._uploadProgressEvent.asObservable();
  }

  /**
   * Delete an image in Firebase storage
   * @param {File} file
   * @returns {Promise<any>}
   */
  public deleteImage(file: File): Promise<any> {
    let item: FileItem = new FileItem(file);
    item.isUploading = true;
    return new Promise((resolve, reject) => {
      this.imageStorageRef.child(`${this.IMAGES_ROOT}/${item.file[ 'name' ]}`)
        .delete()
        .then(() => resolve(null))
        .catch(err => reject(err));
    });
  }

  /**
   * list images in Firebase Storage
   * @param {Bottle} bottle
   * @returns {Observable<Image[]>}
   */
  public listBottleImages(bottle: Bottle): Observable<Image[ ]> {
    return this.angularFirebase.list<Image>(this.XREF_ROOT).valueChanges();
  }

  /**
   * upload any file to Firebase storage
   * @param fileOrBlob
   * @param {BottleMetadata} meta
   * @returns {Promise<void | UploadMetadata>}
   */
  public uploadFileOrBlob(fileOrBlob, meta: BottleMetadata): Promise<void | UploadMetadata> {
    return this.uploadToStorage(fileOrBlob, meta.nomCru)
      .then(
        (uploadSnapshot: any) => {
          //file uploaded successfully URL= uploadSnapshot.downloadURL store reference to storage in database
          return this.saveToDatabaseAssetList(uploadSnapshot, meta);
        },
        (error) => {
          this.notificationService.error('Une erreur s\'est produite en tentant d\'enregistrer l\'image dans la base' +
            ' de données', error);
        });
  }

  private initLogging() {
    this.errorRootRef.once('value', (snap: firebase.database.DataSnapshot) => {
      if (snap.numChildren() > 3) {
        this.errorRootRef.limitToFirst(1).ref.remove();
      }
    });
  }

  private uploadToStorage(imageBlob, name: string): Promise<UploadTaskSnapshot> {
    let fileName = name + '-' + new Date().getTime() + '.jpg';

    return new Promise<UploadTaskSnapshot>((resolve, reject) => {

      let fileRef = this.imageStorageRef.child(fileName);
      let uploadTask = fileRef.put(imageBlob);

      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
                    (snapshot) => {
                      let progress = (uploadTask.snapshot.bytesTransferred / uploadTask.snapshot.totalBytes) * 100;
                      this._uploadProgressEvent.next(Math.round(progress));
                    },
                    (error) => {
                      reject(error);
                    },
                    () => {
                      resolve(uploadTask.snapshot as any);
                    });
    });
  }

  private saveToDatabaseAssetList(uploadSnapshot, meta: BottleMetadata): Promise<UploadMetadata> {
    return new Promise((resolve, reject) => {
      return uploadSnapshot.ref.getDownloadURL().then(
        url => {
          // we will save meta data of image in database
          let dataToSave = {
            'URL': url, // url to access file
            'name': uploadSnapshot.metadata.name, // name of the file
            'owner': firebase.auth().currentUser.uid,
            'email': firebase.auth().currentUser.email,
            'lastUpdated': new Date().getTime(),
            'keywords': meta.keywords,
            'subregion_label': meta.subregion_label,
            'area_label': meta.area_label,
            'nomCru': meta.nomCru
          };

          this.xRefRootRef.push(dataToSave, (response) => {
            if (response != null) {
              reject(response);
            } else {
              //la réponse est null, donc on renvoie ce qui nous intéresse
              resolve(FirebaseImagesService.getUploadImageMeta(uploadSnapshot));
            }
          });
        }
      );

    });
  }
}
