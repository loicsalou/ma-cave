/**
 * Created by loicsalou on 28.02.17.
 */
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AngularFireDatabase} from 'angularfire2/database';
import * as firebase from 'firebase/app';
import * as moment from 'moment';
import {NotificationService} from '../notification.service';
import {Subject} from 'rxjs/Subject';
import {User} from '../../model/user';
import {Reference as FbStorageTypesReference} from '@firebase/storage-types';

import * as schema from './firebase-schema';
import {SearchCriteria} from '../../model/search-criteria';
import Reference = firebase.database.Reference;
import {AdminService} from '../admin.service';

/**
 * Services related to the bottles in the cellar.
 * The subregion_label below are duplicated in the code of france.component.html as they are emitted when end-user
 * clicks on a region to filter bottles. Any change on either side must be propagated on the other side.
 */
@Injectable()
export class FirebaseAdminService implements AdminService {
  public USER_ROOT: string;
  public SHARED_ROOT: string;
  public XREF_ROOT: string;
  protected XREF_FOLDER = 'xref';
  private userRootRef: Reference;
  private SHARED_FOLDER = 'shared';
  private sharedDataRef: FbStorageTypesReference;
  private PROFILE_ROOT: string;
  private profileRootRef: Reference;
  private ERROR_ROOT: string;
  private errorRootRef: Reference;

  constructor(private angularFirebase: AngularFireDatabase,
              private notificationService: NotificationService) {
  }

  public initialize(user: User) {
    let userRoot = user.user;
    this.USER_ROOT = schema.USERS_FOLDER + '/' + userRoot;

    this.SHARED_ROOT = this.SHARED_FOLDER;
    this.XREF_ROOT = this.XREF_FOLDER;
    this.PROFILE_ROOT = schema.USERS_FOLDER + '/' + userRoot + '/' + schema.PROFILE_CONTENT_FOLDER;
    this.ERROR_ROOT = schema.USERS_FOLDER + '/' + userRoot + '/' + schema.ERROR_CONTENT_FOLDER;

    this.userRootRef = this.angularFirebase.database.ref(this.USER_ROOT);
    this.profileRootRef = this.angularFirebase.database.ref(this.PROFILE_ROOT);
    this.errorRootRef = this.angularFirebase.database.ref(this.ERROR_ROOT);
    this.sharedDataRef = this.angularFirebase.app.storage().ref(this.SHARED_ROOT);

    this.initLogging();
  }

  public cleanup() {
    this.USER_ROOT = undefined;
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

  getMostUsedQueries(nb: number): Observable<SearchCriteria[]> {
    return this.angularFirebase.list<SearchCriteria>(this.PROFILE_ROOT).valueChanges()
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

  deleteAccount(): Observable<boolean> {
    let sub = new Subject<boolean>();
    this.userRootRef.remove(error => {
      if (error) {
        this.notificationService.error('app.data-deletion-failed', error);
        sub.next(false);
      } else {
        sub.next(true);
      }
    });
    return sub.asObservable();
  }

  deleteLogs() {
    this.errorRootRef.remove()
  }

  private initLogging() {
    this.errorRootRef.once('value', (snap: firebase.database.DataSnapshot) => {
      if (snap.numChildren() > 3) {
        this.errorRootRef.limitToFirst(1).ref.remove();
      }
    })
  }
}

