/**
 * Created by loicsalou on 28.02.17.
 */
import {Injectable} from '@angular/core';
import {Bottle, BottleMetadata} from '../model/bottle';
import {Observable} from 'rxjs';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {AngularFireDatabase} from 'angularfire2/database';
import * as firebase from 'firebase/app';
import {LoginService} from './login.service';
import {Image} from '../model/image';
import {FileItem} from './file-item';
import {UploadMetadata} from './image-persistence.service';
import {NotificationService} from './notification.service';
import Reference = firebase.database.Reference;
import UploadTaskSnapshot = firebase.storage.UploadTaskSnapshot;
import {Subject} from 'rxjs/Subject';

/**
 * Services related to the bottles in the cellar.
 * The subregion_label below are duplicated in the code of france.component.html as they are emitted when end-user
 * clicks on a region to filter bottles. Any change on either side must be propagated on the other side.
 */
@Injectable()
export class FirebaseConnectionService {
  private static BOTTLES_FOLDER = 'bottles';
  private IMAGES_FOLDER = 'images';
  public IMAGES_ROOT: string;

  protected USERS_FOLDER = 'users';
  private BOTTLES_ROOT: string;
  protected XREF_FOLDER = 'xref';
  public XREF_ROOT: string;

  private bottlesRootRef: Reference;
  private _bottles: BehaviorSubject<Bottle[]> = new BehaviorSubject<Bottle[]>([]);
  private _allBottlesObservable: Observable<Bottle[]> = this._bottles.asObservable();

  private imageStorageRef: firebase.storage.Reference;
  private _uploadProgressEvent: Subject<number> = new Subject<number>();

  constructor(private angularFirebase: AngularFireDatabase, private loginService: LoginService, private notificationService: NotificationService) {
  }

  public initialize(user) {
    this.IMAGES_ROOT = this.IMAGES_FOLDER;
    this.XREF_ROOT = this.XREF_FOLDER;
    this.BOTTLES_ROOT = this.USERS_FOLDER + '/' + this.loginService.user.user + '/' + FirebaseConnectionService.BOTTLES_FOLDER;

    this.bottlesRootRef = this.angularFirebase.database.ref(this.BOTTLES_ROOT);
    this.imageStorageRef = this.angularFirebase.app.storage().ref(this.IMAGES_ROOT);
  }

  public cleanup() {
    this.BOTTLES_ROOT = undefined;
    this.IMAGES_ROOT = undefined;
    this.imageStorageRef = undefined;
    this._bottles.next([]);
  }

  get allBottlesObservable(): Observable<Bottle[ ]> {
    return this._allBottlesObservable;
  }

  public deleteImage(file: File): Promise<any> {
    let item: FileItem = new FileItem(file);
    item.isUploading = true;
    let self = this;
    return new Promise((resolve, reject) => {
      this.imageStorageRef.child(`${this.IMAGES_ROOT}/${item.file[ 'name' ]}`)
        .delete()
        .then(() => resolve(null))
        .catch(err => reject(err));
    })
  }

  public uploadImageToStorage(imageBlob, name: string): Promise<UploadTaskSnapshot> {
    let fileName = name + '-' + new Date().getTime() + '.jpg';

    return new Promise<UploadTaskSnapshot>((resolve, reject) => {

      let fileRef = this.imageStorageRef.child(fileName);
      let uploadTask = fileRef.put(imageBlob);

      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
                    (snapshot) => {
                      let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                      this._uploadProgressEvent.next(Math.round(progress));
                    },
                    (error) => {
                      reject(error);
                    },
                    () => {
                      resolve(uploadTask.snapshot);
                    })
    });
  }

  public listBottleImages(bottle: Bottle): Observable<Image[]> {
    return this.angularFirebase.list(this.XREF_ROOT, {
                                       query: {
                                         limitToFirst: 10,
                                         orderByChild: 'bottleId',
                                         equalTo: bottle[ '$key' ]
                                       }
                                     }
    );
  }

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

  private uploadToStorage(imageBlob, name: string): Promise<UploadTaskSnapshot> {
    let fileName = name + '-' + new Date().getTime() + '.jpg';

    return new Promise<UploadTaskSnapshot>((resolve, reject) => {

      let fileRef = this.imageStorageRef.child(fileName);
      let uploadTask = fileRef.put(imageBlob);

      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
                    (snapshot) => {
                      let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                      this._uploadProgressEvent.next(Math.round(progress));
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
    let ref = firebase.database().ref(this.XREF_ROOT);

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

  public fetchAllBottles() {
    let items = this.angularFirebase.list(this.BOTTLES_ROOT, {
      query: {
        limitToFirst: 2000,
        orderByChild: 'quantite_courante',
        startAt: '0'
      }
    });
    items.subscribe(
      (bottles: Bottle[]) => this._bottles.next(bottles),
      error => this._bottles.error(error),
      () => this._bottles.complete()
    );
  }

  public update(bottles: Bottle[]): Promise<any> {
    return new Promise((resolve, reject) => {
      bottles.forEach(bottle => {
        this.bottlesRootRef.child(bottle[ '$key' ]).set(bottle, (
          err => {
            if (err == null) {
              resolve(null)
            } else {
              reject(err)
            }
          }
        ))
      })
    })
  }

  public save(bottles: Bottle[]): Promise<any> {
    return new Promise((resolve, reject) => {
      bottles.forEach(bottle => {
        this.bottlesRootRef.push(bottle, (
          err => {
            if (err == null) {
              resolve(null)
            } else {
              reject(err)
            }
          }
        ))
      })
    })
  }

  public replaceBottle(bottle: Bottle) {
    return new Promise((resolve, reject) => {
                         this.bottlesRootRef.child(bottle[ '$key' ]).set(bottle, err => {
                                                                           if (err == null) {
                                                                             resolve(null)
                                                                           } else {
                                                                             reject(err)
                                                                           }
                                                                         }
                         )
                       }
    )
  }

  public deleteBottles() {
    return new Promise((resolve, reject) => {
                         this.bottlesRootRef.remove(err => {
                                                      if (err == null) {
                                                        resolve(null)
                                                      } else {
                                                        reject(err)
                                                      }
                                                    }
                         )
                       }
    )
  }
}


