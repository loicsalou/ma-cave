/**
 * Created by loicsalou on 28.02.17.
 */
import * as firebase from 'firebase/app';
import * as moment from 'moment';
import * as schema from './firebase-schema';

import {Injectable} from '@angular/core';
import {Bottle} from '../../model/bottle';
import {Observable} from 'rxjs';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {AngularFireDatabase, SnapshotAction} from 'angularfire2/database';
import {Image} from '../../model/image';
import {NotificationService} from '../notification.service';
import {BottleFactory} from '../../model/bottle.factory';
import {User} from '../../model/user';
import {Subscription} from 'rxjs/Subscription';
import {Locker} from '../../model/locker';
import {sanitizeBeforeSave} from '../../utils/index';
import Reference = firebase.database.Reference;

/**
 * Services related to the bottles in the cellar.
 * The subregion_label below are duplicated in the code of france.component.html as they are emitted when end-user
 * clicks on a region to filter bottles. Any change on either side must be propagated on the other side.
 */
@Injectable()
export class FirebaseBottlesService {
  public USER_ROOT: string;
  public XREF_ROOT: string;
  private BOTTLES_ROOT: string;
  private ERROR_ROOT: string;

  private userRootRef: Reference;
  private bottlesRootRef: Reference;
  private _bottles: BehaviorSubject<Bottle[]>;
  private firebaseBottlesSub: Subscription;
  private errorRootRef: Reference;
  private connectionAllowed: boolean = true;

  constructor(private bottleFactory: BottleFactory,
              private angularFirebase: AngularFireDatabase,
              private notificationService: NotificationService) {
  }

  private _allBottlesObservable: Observable<Bottle[]>;

  get allBottlesObservable(): Observable<Bottle[ ]> {
    this._bottles = new BehaviorSubject<Bottle[]>([]);
    this._allBottlesObservable = this._bottles.asObservable();
    return this._allBottlesObservable;
  }

  public initialize(user: User) {
    let userRoot = user.user;
    this.USER_ROOT = schema.USERS_FOLDER + '/' + userRoot;

    this.XREF_ROOT = schema.XREF_FOLDER;
    this.BOTTLES_ROOT = schema.USERS_FOLDER + '/' + userRoot + '/' + schema.BOTTLES_FOLDER;
    this.ERROR_ROOT = schema.USERS_FOLDER + '/' + userRoot + '/' + schema.ERROR_CONTENT_FOLDER;

    this.userRootRef = this.angularFirebase.database.ref(this.USER_ROOT);
    this.bottlesRootRef = this.angularFirebase.database.ref(this.BOTTLES_ROOT);
    this.errorRootRef = this.angularFirebase.database.ref(this.ERROR_ROOT);

    this.initLogging();
  }

  public cleanup() {
    this.USER_ROOT = undefined;
    this.BOTTLES_ROOT = undefined;
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

// ===================================================== BOTTLES

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

  //============================= Image management
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
    return this.angularFirebase.list<Image>(this.XREF_ROOT).valueChanges();
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
        updates[ '/' + schema.BOTTLES_FOLDER + '/' + bottle.id ] = bottle;
      });
      locker[ 'lastUpdated' ] = new Date().getTime();
      locker = sanitizeBeforeSave(locker);
      updates[ '/' + schema.CELLAR_FOLDER + '/' + locker.id ] = locker;
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

  private initLogging() {
    this.errorRootRef.once('value', (snap: firebase.database.DataSnapshot) => {
      if (snap.numChildren() > 3) {
        this.errorRootRef.limitToFirst(1).ref.remove();
      }
    })
  }

  //============== NO CACHE AVAILABLE
  private fetchAllBottlesFromDB(): Subscription {
    this.notificationService.debugAlert('fetchAllBottlesFromDB()');
    let items = this.angularFirebase.list<Bottle>(this.BOTTLES_ROOT).snapshotChanges();

    return items.subscribe(
      (changes: SnapshotAction[]) => {
        const bottles = changes.map(
          c => this.bottleFactory.create({id: c.payload.key, ...c.payload.val()})
        );
        this._bottles.next(bottles);
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
  //private queryOrderByLastUpdate(fromLastUpdated: number): FirebaseListObservable<any[ ]> {
  private queryOrderByLastUpdate(fromLastUpdated: number): Observable<Bottle[ ]> {
    if (isNaN(fromLastUpdated)
    ) {
      fromLastUpdated = 0;
    }
    let query = {
      orderByChild: 'lastUpdated',
      startAt: fromLastUpdated
    };

    return this.angularFirebase.list<Bottle>(this.BOTTLES_ROOT).valueChanges();
    //, {query});
  }
}
