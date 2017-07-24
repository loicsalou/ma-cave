/**
 * Created by loicsalou on 28.02.17.
 */
import {Injectable} from '@angular/core';
import {Bottle, BottleMetadata} from '../model/bottle';
import {Observable} from 'rxjs';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import * as firebase from 'firebase/app';
import {LoginService} from './login.service';
import {Image} from '../model/image';
import {FileItem} from './file-item';
import {UploadMetadata} from './image-persistence.service';
import {NotificationService} from './notification.service';
import {Subject} from 'rxjs/Subject';
import {NativeStorageService} from './native-storage.service';
import {Platform} from 'ionic-angular';
import * as _ from 'lodash';
import {BottleFactory} from '../model/bottle.factory';
import {User} from '../model/user';
import {Subscription} from 'rxjs/Subscription';
import Reference = firebase.database.Reference;
import UploadTaskSnapshot = firebase.storage.UploadTaskSnapshot;

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
  private cacheBottles: Bottle[];
  private connectionAllowed: boolean = true;
  private localStorageSub: Subscription;
  private firebaseSub: Subscription;

  //date de dernière mise à jour d'une bouteille dans le cache

  constructor(private bottleFactory: BottleFactory, private angularFirebase: AngularFireDatabase, private loginService: LoginService,
              private notificationService: NotificationService, private localStorage: NativeStorageService,
              private platform: Platform) {
  }

  public initialize(user: User) {
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
    if (this.localStorageSub) {
      this.localStorageSub.unsubscribe();
    }
    this.firebaseSub.unsubscribe();
  }

  get allBottlesObservable(): Observable<Bottle[ ]> {
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
    // on prend déjà ce qu'on a dans le caceh
    this.fetchFromCache();
    //option: pas de connexion autorisée ==> on se contente de ça
    if (!this.connectionAllowed) {
      return;
    }
    //on vérifie maintenant la cohérence avec la DB
    this.fetchAllBottlesFromDB();
  }

  private fetchFromDBStartingAt(startDate: number, key: string) {
    this.notificationService.debugAlert('fetchAllBottles() - cacheAvailable - chargement des mises à jour depuis '
      + startDate + ' key=' + key);
    //récupérer en DB toutes les bouteilles mises à jour depuis la date de dernière mise à jour du cache (le +1 permet
    // d'exclure la date la plus récente en local puisqu'on l'a déjà)
    let items = this.queryOrderByLastUpdate(startDate);
    this.firebaseSub = items.subscribe(
      (bottles: Bottle[]) => {
        this.notificationService.debugAlert(bottles.length + ' mises à jour depuis la DB - ' + startDate +
          ' - ' + JSON.stringify(bottles));
        if (bottles.length > 0) {
          //prepare loaded bottles for the app
          bottles.forEach((bottle: Bottle) => this.bottleFactory.create(bottle));
          this.updateCache(bottles);
        }
      },
      error => {
        this._bottles.error(error);
      },
      () => this._bottles.complete()
    );
  }

  private fetchAllBottlesFromDB() {
    let items = this.angularFirebase.list(this.BOTTLES_ROOT, {
      query: {
        orderByChild: 'lastUpdated'
      }
    });

    this.firebaseSub = items.subscribe(
      (bottles: Bottle[]) => {
        if (bottles.length > 0) {
          //prepare loaded bottles for the app
          bottles.forEach((bottle: Bottle) => this.bottleFactory.create(bottle));
          this._bottles.next(bottles);
        }
      },
      error => {
        this._bottles.error(error);
      },
      () => this._bottles.complete()
    );
  }

  /**
   * query the db and loads nbrows last updated bottles.
   * return the corresponding observable.
   * @param nbrows that should be retrieved from the DB
   */
  private queryOrderByLastUpdate(fromLastUpdated: number): FirebaseListObservable<any[]> {
    if (isNaN(fromLastUpdated)) {
      fromLastUpdated = 0;
    }
    let query = {
      orderByChild: 'lastUpdated',
      startAt: fromLastUpdated
    };

    return this.angularFirebase.list(this.BOTTLES_ROOT, {query});
  }

  private fetchFromCache(): boolean {
    if (this.platform.is('cordova')) {
      this.localStorageSub = this.localStorage.allBottlesObservable.subscribe(
        (bottles: Bottle[]) => this.handleCacheObservable(bottles),
        error => this.notificationService.error('L\'accès à la liste locale des bouteilles a échoué !', error)
      );

      this.localStorage.fetchAllBottles();
      return true;
    }
    return false;
  }

  private handleCacheObservable(bottles: Bottle[]) {
    //d'abord on émet ce qu'on a dans le cache
    this.notificationService.debugAlert('handleCacheObservable()' + (bottles ? bottles.length : 'rien dans le cache'));
    this._bottles.next(bottles);
    //puis on trie par date de dernière mise à jour et on va chercher en DB ce qui a été mise à jour depuis pour
    // remettre le cache à jour
    this.cacheBottles = bottles;
    if (this.cacheBottles.length > 0) {
      this.cacheBottles.sort(sortByLastUpdate).reverse();
      this.fetchFromDBStartingAt(this.cacheBottles[ 0 ].lastUpdated + 1, this.cacheBottles[ 0 ][ 'id' ])
    }
  }

  public deleteImage(file: File): Promise<any> {
    if (!this.connectionAllowed) {
      this.notificationService.i18nFailed('app.unavailable-function');
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

  public uploadImageToStorage(imageBlob, name: string): Promise<UploadTaskSnapshot> {
    if (!this.connectionAllowed) {
      this.notificationService.i18nFailed('app.unavailable-function');
      return;
    }
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
    if (!this.connectionAllowed) {
      this.notificationService.i18nFailed('app.unavailable-function');
      return undefined;
    }
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
    if (!this.connectionAllowed) {
      this.notificationService.i18nFailed('app.unavailable-function');
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

  public update(bottles: Bottle[ ]): Promise<any> {
    if (!this.connectionAllowed) {
      this.notificationService.i18nFailed('');
      return undefined;
    }
    return new Promise((resolve, reject) => {
      bottles.forEach(bottle => {
        bottle[ 'lastUpdated' ] = new Date().getTime();
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

  public save(bottles: Bottle[ ]): Promise<any> {
    if (!this.connectionAllowed) {
      this.notificationService.failed('Sauvegarde indisponible en offline');
      return undefined;
    }
    return new Promise((resolve, reject) => {
      bottles.forEach(bottle => {
        bottle[ 'lastUpdated' ] = new Date().getTime();
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
    if (!this.connectionAllowed) {
      this.notificationService.failed('Replace indisponible en offline');
      return undefined;
    }
    return new Promise((resolve, reject) => {
                         bottle[ 'lastUpdated' ] = new Date().getTime();
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

  /**
   * comparer firebaseBottles avec this.cacheBottles et si des bouteilles ont été ajoutées ou mises à jour
   * dans la base, on enlève du cache les anciennes versions et on ajoute les différences dans le cache puis il
   faut encore sauvegarder le cache dans le native storage.
   * @param firebaseBottles contient les bouteilles qui sont différentes dans la DB firebase et dans le cache. La DB
   * est bien sûr la référence.
   * @returns {boolean} indicating if cache is up to date after change or not
   */
  private updateCache(firebaseBottles: Bottle[]): boolean {
    //
    if (!this.cacheBottles) {
      this.cacheBottles = [];
    }
    if (firebaseBottles.length !== 0) {
      this.notificationService.debugAlert('updateCache() - contrôle du cache: ' + firebaseBottles.length + ' différences' +
        ' trouvées');
      //create new cache: remove updated bottles then add updated to cache bottles and we're done
      let size = this.cacheBottles.length;
      let newCache = _.pullAllWith(this.cacheBottles, firebaseBottles, matchByKey);
      let sizeAfterRemove = this.cacheBottles.length;
      newCache = _.concat(this.cacheBottles, firebaseBottles);
      let finalsize = newCache.length;
      this.notificationService.debugAlert('taille du cache avant / après suppression / après màj=' + size + '/' + sizeAfterRemove + '/' + finalsize);

      // on upgrade le cache
      this.localStorage.save(newCache);
      this.cacheBottles = newCache;
      this.notificationService.information('cache rafraichi: ' + firebaseBottles.length + ' ajouts / modifications');
      return true;
    } else {
      this.notificationService.debugAlert('cache déjà à jour');
      return false;
    }
  }

  isConnectionAllowed(): boolean {
    return this.connectionAllowed;
  }

  setConnectionAllowed(b: boolean) {
    this.connectionAllowed = b;
  }
}

function matchByKeyAndLastUpdateDate(fbBottle, cacheBottle) {
  if (!cacheBottle) {
    //une bouteille est dans FB mais pas dans le cache ==> il n'y a pas matching
    return false;
  }
  return (fbBottle.lastUpdated === cacheBottle.lastUpdated && fbBottle.$key === cacheBottle.id);
}

function matchByKey(fbBottle, cacheBottle) {
  return (fbBottle.$key === cacheBottle.id);
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
