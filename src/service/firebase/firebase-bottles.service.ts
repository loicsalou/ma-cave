/**
 * Created by loicsalou on 28.02.17.
 */
import * as firebase from 'firebase/app';
import * as moment from 'moment';
import * as schema from './firebase-schema';

import {Injectable} from '@angular/core';
import {Bottle} from '../../model/bottle';
import {Observable} from 'rxjs';
import {AngularFireDatabase, SnapshotAction} from 'angularfire2/database';
import {Image} from '../../model/image';
import {NotificationService} from '../notification.service';
import {BottleFactory} from '../../model/bottle.factory';
import {User} from '../../model/user';
import {Locker} from '../../model/locker';
import {sanitizeBeforeSave} from '../../utils/index';
import {fromPromise} from 'rxjs/observable/fromPromise';
import {_throw} from 'rxjs/observable/throw';
import {of} from 'rxjs/observable/of';
import {map, take, tap} from 'rxjs/operators';
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
  private errorRootRef: Reference;

  constructor(private bottleFactory: BottleFactory,
              private angularFirebase: AngularFireDatabase,
              private notificationService: NotificationService) {
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

  //============================= Image management
  /**
   * list images in Firebase Storage
   * @param {Bottle} bottle
   * @returns {Observable<Image[]>}
   */
  public listBottleImages(bottle: Bottle): Observable<Image[]> {
    return this.angularFirebase.list<Image>(this.XREF_ROOT).valueChanges();
  }

  // ======================== Gestion des bouteilles
  /**
   * met à jour dans une transaction les bouteilles passées en paramètre.
   * Soit toute la mise à jour est faite, soit rien n'est mis à jour.
   * @param {Bottle[]} bottles
   * @returns {Promise<any>}
   */
  public update(bottles: Bottle[]): Observable<Bottle[]> {
    let updates = {};
    bottles.forEach(bottle => {
      bottle[ 'lastUpdated' ] = new Date().getTime();
      updates[ '/' + bottle.id ] = sanitizeBeforeSave(bottle);
    });
    this.notificationService.debugAlert('sur le point de this.bottlesRootRef.update(' + JSON.stringify(updates) + ')');
    return fromPromise(this.bottlesRootRef.update(updates)
                         .then(() => bottles)
                         .catch(err => err)
    );
  }

  /**
   * Transaction de mise à jour d'un casier et de son contenu. Soit toute la mise à jour est faite soit rien n'est
   * mis à jour, ce afin de préserver la cohérence des données.
   * @param {Bottle[]} bottles bouteilles du casier
   * @param {Locker} locker casier contenant les bouteilles
   * @returns {Promise<any>}
   */
  public updateLockerAndBottles(bottles: Bottle[], locker: Locker): Observable<{ bottles: Bottle[], locker: Locker }> {
    let updates = {};
    bottles.forEach(bottle => {
      bottle[ 'lastUpdated' ] = new Date().getTime();
      updates[ '/' + schema.BOTTLES_FOLDER + '/' + bottle.id ] = bottle;
    });
    locker[ 'lastUpdated' ] = new Date().getTime();
    locker = sanitizeBeforeSave(locker);
    updates[ '/' + schema.CELLAR_FOLDER + '/' + locker.id ] = locker;
    return fromPromise(
      this.userRootRef.update(updates)
        .then(() => {
                return {bottles: bottles, locker: locker};
              }
        )
        .catch(err => err)
    );
  }

  public saveBottles(bottles: Bottle[]): Observable<Bottle[]> {
    bottles.forEach(bottle => {
      bottle[ 'lastUpdated' ] = new Date().getTime();
      this.bottlesRootRef.push(sanitizeBeforeSave(bottle), (
        err => {
          if (err !== null) {
            this.notificationService.error('La sauvegarde a échoué pour ' + bottle.nomCru + ' : ' + err);
            _throw(err);
          }
        }
      ));
    });

    return of(bottles);
  }

  public replaceBottle(bottle: Bottle): Observable<Bottle> {
    bottle[ 'lastUpdated' ] = new Date().getTime();
    return fromPromise(
      this.bottlesRootRef.child(bottle.id).set(sanitizeBeforeSave(bottle))
        .then(() => bottle)
        .catch(err => err)
    );
  }

  public deleteBottles(): Observable<boolean> {
    return fromPromise(
      this.bottlesRootRef.remove()
        .then(() => true)
        .catch(err => {
                 this.notificationService.error('les bouteilles n\'ont pu être supprimées: ' + err);
                 return false;
               }
        )
    );
  }

  //============== NO CACHE AVAILABLE
  public fetchAllBottlesFromDB(): Observable<Bottle[]> {
    this.notificationService.debugAlert('fetchAllBottlesFromDB()');
    let popup = this.notificationService.createLoadingPopup('app.loading');
    popup.onDidDismiss(() =>
                         popup = undefined
    );
    return this.angularFirebase.list<Bottle>(this.BOTTLES_ROOT).snapshotChanges().pipe(
      take(1),
      map(
        (snaps: SnapshotAction[]) => snaps.map(snap => this.bottleFactory.create({id: snap.payload.key, ...snap.payload.val()}))
      ),
      tap(() => {
            if (popup) {
              popup.dismiss();
            }
          }
      )
    );
  }

  private initLogging() {
    this.errorRootRef.once('value', (snap: firebase.database.DataSnapshot) => {
      if (snap.numChildren() > 3) {
        this.errorRootRef.limitToFirst(1).ref.remove();
      }
    });
  }
}
