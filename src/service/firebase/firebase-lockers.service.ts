
import {map} from 'rxjs/operators';
/**
 * Created by loicsalou on 28.02.17.
 */
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AngularFireDatabase, SnapshotAction} from 'angularfire2/database';
import {NotificationService} from '../notification.service';
import {User} from '../../model/user';
import {SimpleLocker} from '../../model/simple-locker';
import {Locker} from '../../model/locker';
import {sanitizeBeforeSave} from '../../utils/index';

import * as firebase from 'firebase/app';
import * as schema from './firebase-schema';
import * as moment from 'moment';
import Reference = firebase.database.Reference;

/**
 * Services related to the lockers in the cellar.
 */
@Injectable()
export class FirebaseLockersService {
  private CELLAR_ROOT: string;
  private cellarRootRef: Reference;
  private ERROR_ROOT: string;
  private errorRootRef: Reference;

  constructor(private angularFirebase: AngularFireDatabase,
              private notificationService: NotificationService) {
  }

  public initialize(user: User) {
    let userRoot = user.user;

    this.CELLAR_ROOT = schema.USERS_FOLDER + '/' + userRoot + '/' + schema.CELLAR_FOLDER;
    this.ERROR_ROOT = schema.USERS_FOLDER + '/' + userRoot + '/' + schema.ERROR_CONTENT_FOLDER;

    this.cellarRootRef = this.angularFirebase.database.ref(this.CELLAR_ROOT);
    this.errorRootRef = this.angularFirebase.database.ref(this.ERROR_ROOT);
  }

  public cleanup() {
    this.CELLAR_ROOT = undefined;
    this.ERROR_ROOT = undefined;
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
      .list<Locker>(this.CELLAR_ROOT).snapshotChanges().pipe(
      map(
        (changes: SnapshotAction<any>[]) => {
          return changes.map(c => ({id: c.payload.key, ...c.payload.val()}));
        }
      ));
  }

  public createLocker(locker: Locker): void {
    this.cellarRootRef.push(sanitizeBeforeSave(locker), (
      err => {
        if (err !== null) {
          throw err;
        }
      }
    ));
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
          this.notificationService.failed('La suppression des casiers a échoué', error);
        }
      }
    );
  }
}
