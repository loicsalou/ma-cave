/**
 * Created by loicsalou on 28.02.17.
 */
import {Injectable} from '@angular/core';
import {Bottle, BottleMetadata} from '../model/bottle';
import {Observable} from 'rxjs';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import * as firebase from 'firebase/app';
import * as moment from 'moment';
import {LoginService} from './login.service';
import {Image} from '../model/image';
import {FileItem} from './file-item';
import {UploadMetadata} from './image-persistence.service';
import {NotificationService} from './notification.service';
import {Subject} from 'rxjs/Subject';
import {Platform} from 'ionic-angular';
import {BottleFactory} from '../model/bottle.factory';
import {User} from '../model/user';
import {Subscription} from 'rxjs/Subscription';
import {SimpleLocker} from '../model/simple-locker';
import {Locker} from '../model/locker';
import {Query} from 'angularfire2/database/interfaces';
import Reference = firebase.database.Reference;
import UploadTaskSnapshot = firebase.storage.UploadTaskSnapshot;

/**
 * Services related to the bottles in the cellar.
 * The subregion_label below are duplicated in the code of france.component.html as they are emitted when end-user
 * clicks on a region to filter bottles. Any change on either side must be propagated on the other side.
 */
@Injectable()
export class FirebaseConnectionService {
  public USER_ROOT: string;
  protected USERS_FOLDER = 'users';

  public IMAGES_ROOT: string;
  private IMAGES_FOLDER = 'images';

  private BOTTLES_ROOT: string;
  private static BOTTLES_FOLDER = 'bottles';

  private CELLAR_ROOT: string;
  private static CELLAR_FOLDER = 'cellar';

  private LOCKER_CONTENT_ROOT: string;
  private static LOCKER_CONTENT_FOLDER = 'content';
  private lockerContentRootRef: Reference;

  private PROFILE_ROOT: string;
  private static PROFILE_CONTENT_FOLDER = 'profile';
  private profileRootRef: Reference;

  private ERROR_ROOT: string;
  private static ERROR_CONTENT_FOLDER: string = 'error';
  private errorRootRef: Reference;

  protected XREF_FOLDER = 'xref';
  public XREF_ROOT: string;

  private userRootRef: Reference;

  private bottlesRootRef: Reference;
  private _bottles: BehaviorSubject<Bottle[]>;
  private _allBottlesObservable: Observable<Bottle[]>;
  private firebaseBottlesSub: Subscription;

  private cellarRootRef: Reference;

  private imageStorageRef: firebase.storage.Reference;
  private _uploadProgressEvent: Subject<number> = new Subject<number>();
  private connectionAllowed: boolean = true;

  constructor(private bottleFactory: BottleFactory,
              private angularFirebase: AngularFireDatabase, private loginService: LoginService,
              private notificationService: NotificationService,
              private platform: Platform) {
  }

  public initialize(user: User) {
    this.IMAGES_ROOT = this.IMAGES_FOLDER;
    this.XREF_ROOT = this.XREF_FOLDER;
    this.USER_ROOT = this.USERS_FOLDER + '/' + this.loginService.user.user;
    this.BOTTLES_ROOT = this.USERS_FOLDER + '/' + this.loginService.user.user + '/' + FirebaseConnectionService.BOTTLES_FOLDER;
    this.CELLAR_ROOT = this.USERS_FOLDER + '/' + this.loginService.user.user + '/' + FirebaseConnectionService.CELLAR_FOLDER;
    this.LOCKER_CONTENT_ROOT = this.USERS_FOLDER + '/' + this.loginService.user.user + '/' + FirebaseConnectionService.LOCKER_CONTENT_FOLDER;
    this.PROFILE_ROOT = this.USERS_FOLDER + '/' + this.loginService.user.user + '/' + FirebaseConnectionService.PROFILE_CONTENT_FOLDER;
    this.ERROR_ROOT = this.USERS_FOLDER + '/' + this.loginService.user.user + '/' + FirebaseConnectionService.ERROR_CONTENT_FOLDER;

    this.userRootRef = this.angularFirebase.database.ref(this.USER_ROOT);
    this.bottlesRootRef = this.angularFirebase.database.ref(this.BOTTLES_ROOT);
    this.cellarRootRef = this.angularFirebase.database.ref(this.CELLAR_ROOT);
    this.lockerContentRootRef = this.angularFirebase.database.ref(this.LOCKER_CONTENT_ROOT);
    this.profileRootRef = this.angularFirebase.database.ref(this.PROFILE_ROOT);
    this.errorRootRef = this.angularFirebase.database.ref(this.ERROR_ROOT);
    this.imageStorageRef = this.angularFirebase.app.storage().ref(this.IMAGES_ROOT);

    this.initLogging();
  }

  private initLogging() {
    this.angularFirebase.list(this.ERROR_ROOT).map(
      errors => {
        if (errors && errors.length > 3) {
          this.errorRootRef.limitToFirst(1).ref.remove();
        }
      }
    ).take(1).subscribe(
      () => this.errorRootRef = this.errorRootRef.push(moment().format('YYYY-MM-DD HH:mm:ss'))
    );
  }

  public cleanup() {
    this.USER_ROOT = undefined;
    this.CELLAR_ROOT = undefined;
    this.BOTTLES_ROOT = undefined;
    this.IMAGES_ROOT = undefined;
    this.imageStorageRef = undefined;
    this._bottles.next([]);
    this.firebaseBottlesSub.unsubscribe();
  }

  // ===================================================== ERRORS

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

  // ===================================================== LOCKERS
  public fetchAllLockers(): Observable<Locker[]> {
    return this.angularFirebase
      .list(this.CELLAR_ROOT, {
        query: {
          orderByChild: 'lastUpdated'
        }
      })
      .map(
        (lockers: Locker[]) => {
          if (lockers.length > 0) {
            //prepare loaded bottles for the app
            lockers = lockers.map(
              l => {
                l[ 'id' ] = l[ '$key' ];
                return l;
              })
          }
          return lockers
        }
      )
  }

  public createLocker(locker: Locker): void {
    this.cellarRootRef.push(sanitizeBeforeSave(locker), (
      err => {
        if (err !== null) {
          throw err
        }
      }
    ))
  }

  public replaceLocker(locker: SimpleLocker) {
    this.cellarRootRef.child(locker.id)
      .set(sanitizeBeforeSave(locker),
           err => {
             if (err) {
               this.notificationService.failed('La sauvegarde a échoué ! ', err);
             }
           });
  }

  public deleteLocker(locker: Locker) {
    this.cellarRootRef.child(locker.id).remove(
      error => {
        if (error !== null) {
          this.notificationService.failed('La suppression des casiers a échoué', error)
        }
      }
    )
  }

// ===================================================== BOTTLES

  get allBottlesObservable(): Observable<Bottle[ ]> {
    this._bottles = new BehaviorSubject<Bottle[]>([]);
    this._allBottlesObservable = this._bottles.asObservable();
    return this._allBottlesObservable;
  }

  /**
   * récupérer du cache si il y en a un.
   * prendre la date de mise à jour la plus récente dans le cache et aller chercher en DB les màj plus récentes que
   * cette date. Remettre à jour le cache et ré-émettre les données pour l'affichage.
   *
   * @returns {undefined}
   */
  public fetchAllBottles() {
    this.notificationService.debugAlert('fetchAllBottles()');
    this.firebaseBottlesSub = this.fetchAllBottlesFromDB();
  }

  //============== NO CACHE AVAILABLE
  private fetchAllBottlesFromDB(): Subscription {
    this.notificationService.debugAlert('fetchAllBottlesFromDB()');
    let items = this.angularFirebase.list(this.BOTTLES_ROOT, {
      query: {
        orderByChild: 'lastUpdated'
      }
    });

    return items.subscribe(
      (bottles: Bottle[]) => {
        if (bottles.length > 0) {
          //prepare loaded bottles for the app
          this._bottles.next(bottles.map(
            (bottle: Bottle) => this.bottleFactory.create(bottle))
          );
        }
      },
      error => {
        this._bottles.error(error);
      },
      () => this._bottles.complete()
    );
  }

  /**
   * query the db and loads all bottles updated after the most recent one in the cache
   * return the corresponding observable.
   * @param fromLastUpdated most recent known bottle in cache
   */
  private queryOrderByLastUpdate(fromLastUpdated: number): FirebaseListObservable<any[ ]> {
    if (isNaN(fromLastUpdated)
    ) {
      fromLastUpdated = 0;
    }
    let query = {
      orderByChild: 'lastUpdated',
      startAt: fromLastUpdated
    };

    return this.angularFirebase.list(this.BOTTLES_ROOT, {query});
  }

  //============================= Image management
  /**
   * Delete an image in Firebase storage
   * @param {File} file
   * @returns {Promise<any>}
   */
  public deleteImage(file: File): Promise<any> {
    if (!
        this.connectionAllowed
    ) {
      this.notificationService.failed('app.unavailable-function');
      return;
    }
    let item: FileItem = new FileItem(file);
    item.isUploading = true;
    return new Promise((resolve, reject) => {
      this.imageStorageRef.child(`${this.IMAGES_ROOT}/${item.file[ 'name' ]}`)
        .delete()
        .then(() => resolve(null))
        .catch(err => reject(err));
    })
  }

  /**
   * list images in Firebase Storage
   * @param {Bottle} bottle
   * @returns {Observable<Image[]>}
   */
  public listBottleImages(bottle: Bottle): Observable<Image[ ]> {
    if (!
        this.connectionAllowed
    ) {
      this.notificationService.failed('app.unavailable-function');
      return undefined;
    }
    return this.angularFirebase.list(this.XREF_ROOT, {
                                       query: {
                                         limitToFirst: 10,
                                         orderByChild: 'bottleId',
                                         equalTo: bottle.id
                                       }
                                     }
    );
  }

  /**
   * upload any file to Firebase storage
   * @param fileOrBlob
   * @param {BottleMetadata} meta
   * @returns {Promise<void | UploadMetadata>}
   */
  public uploadFileOrBlob(fileOrBlob, meta: BottleMetadata): Promise<void | UploadMetadata> {
    if (!
        this.connectionAllowed
    ) {
      this.notificationService.failed('app.unavailable-function');
      return undefined;
    }
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
                      let progress = (uploadTask.snapshot.bytesTransferred / uploadTask.snapshot.totalBytes) * 100;
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
        resolve(this.getUploadImageMeta(uploadSnapshot));
      }).catch((_error) => {
        reject(_error);
      });
    });
  }

  private getUploadImageMeta(snap): UploadMetadata {
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

  // ======================== Gestion des bouteilles
  /**
   * met à jour dans une transaction les bouteilles passées en paramètre.
   * Soit toute la mise à jour est faite, soit rien n'est mis à jour.
   * @param {Bottle[]} bottles
   * @returns {Promise<any>}
   */
  public update(bottles: Bottle[ ]): Promise<any> {
    if (!this.connectionAllowed) {
      this.notificationService.failed('update.failed');
      return undefined;
    }

    return new Promise((resolve, reject) => {
      let updates = {};
      bottles.forEach(bottle => {
        bottle[ 'lastUpdated' ] = new Date().getTime();
        updates[ '/' + bottle.id ] = sanitizeBeforeSave(bottle);
      });
      this.notificationService.debugAlert('sur le point de this.bottlesRootRef.update(' + JSON.stringify(updates) + ')');
      this.bottlesRootRef.update(updates, (
        err => {
          if (err == null) {
            this.notificationService.debugAlert('mise à jour OK');
            resolve(null)
          } else {
            this.notificationService.debugAlert('mise à jour KO ' + err);
            reject(err)
          }
        }
      ));
    })
  }

  /**
   * Transaction de mise à jour d'un casier et de son contenu. Soit toute la mise é jour est faite soit rien n'est
   * mis à jour, ce afin de préserver la cohérence des données.
   * @param {Bottle[]} bottles bouteilles du casier
   * @param {Locker} locker casier contenant les bouteilles
   * @returns {Promise<any>}
   */
  public updateLockerAndBottles(bottles: Bottle[ ], locker: Locker): Promise<any> {
    if (!
        this.connectionAllowed
    ) {
      this.notificationService.failed('update.failed');
      return undefined;
    }

    return new Promise((resolve, reject) => {
      let updates = {};
      bottles.forEach(bottle => {
        bottle[ 'lastUpdated' ] = new Date().getTime();
        updates[ '/' + FirebaseConnectionService.BOTTLES_FOLDER + '/' + bottle.id ] = bottle;
      });
      locker[ 'lastUpdated' ] = new Date().getTime();
      locker = sanitizeBeforeSave(locker);
      updates[ '/' + FirebaseConnectionService.CELLAR_FOLDER + '/' + locker.id ] = locker;
      this.userRootRef.update(updates, (
        err => {
          if (err == null) {
            resolve(null)
          } else {
            reject(err)
          }
        }
      ));
    })
  }

  public saveBottles(bottles: Bottle[ ]): Promise<any> {
    if (!
        this.connectionAllowed
    ) {
      this.notificationService.failed('Sauvegarde indisponible en offline');
      return undefined;
    }
    return new Promise((resolve, reject) => {
      bottles.forEach(bottle => {
        bottle[ 'lastUpdated' ] = new Date().getTime();
        this.bottlesRootRef.push(sanitizeBeforeSave(bottle), (
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
    if (!this.connectionAllowed) {
      this.notificationService.failed('Replace indisponible en offline');
      return undefined;
    }
    return new Promise((resolve, reject) => {
                         bottle[ 'lastUpdated' ] = new Date().getTime();
                         this.bottlesRootRef.child(bottle.id).set(sanitizeBeforeSave(bottle), err => {
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
    if (!this.connectionAllowed) {
      this.notificationService.failed('Suppression indisponible en offline');
      return undefined;
    }
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

  isConnectionAllowed(): boolean {
    return this.connectionAllowed;
  }

  setConnectionAllowed(b: boolean) {
    this.connectionAllowed = b;
  }

  disconnectListeners() {
    this.firebaseBottlesSub.unsubscribe()
  }

  reconnectListeners() {
    this.fetchAllBottles();
  }

  getMostUsedQueries(nb: number): Observable<SearchCriteria[]> {
    let query: Query = {
      orderByChild: 'lastUpdated',
      limitToLast: nb
    };

    return this.angularFirebase.list(this.PROFILE_ROOT, {query})
      .flatMap(arr => {
        if (arr) {
          return Observable.of(arr.reverse());
        } else {
          return Observable.of([]);
        }
      });
  }

  updateQueryStats(keywords: string[]) {
    let key = keywords.join('-');
    this.profileRootRef.child(key).once('value').then(
      snapshot => {
        if (snapshot.val()) {
          let count = snapshot.val().count + 1;
          this.profileRootRef.child(key).update({keywords: keywords, count: count});
        } else {
          this.profileRootRef.child(key).set({keywords: keywords, count: 1});
        }
      },
      onerror => console.error('firebase error: ' + onerror)
    )
  }

  removeFromQueryStats(keywords: any) {
    let key = keywords.join('-');
    this.profileRootRef.child(key).remove(
      errorOrNull => console.info('removeFromQueryStats ended with ' + errorOrNull)
    )
  }
}

export interface SearchCriteria {
  keywords: string[];
  count: number;
}

function matchByKey(fbBottle, cacheBottle) {
  return (fbBottle.id === cacheBottle.id);
}

function sortByLastUpdate(btl1, btl2) {
  let dt1 = btl1.lastUpdated;
  if (!dt1) {
    dt1 = 0;
  }
  let dt2 = btl2.lastUpdated;
  if (!dt2) {
    dt2 = 0;
  }
  return dt1 - dt2;
}

function sanitizeBeforeSave(object) {
  return JSON.parse(JSON.stringify(object, function (k, v) {
    if (v === undefined) {
      return null;
    }
    return v;
  }));
}
