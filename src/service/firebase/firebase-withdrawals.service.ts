import {Inject, Injectable} from '@angular/core';
import {Observable, of, throwError} from 'rxjs';
import {NotificationService} from '../notification.service';
import {WithdrawalFactory} from '../../model/withdrawal.factory';
import {User} from '../../model/user';
import {Withdrawal} from '../../model/withdrawal';
import {BottleNoting} from '../../components/bottle-noting/bottle-noting.component';
import * as schema from './firebase-schema';
import * as tools from '../../utils/index';
import {logInfo} from '../../utils/index';
import {AngularFireDatabase, SnapshotAction} from 'angularfire2/database';
import {filter, map, take, tap, throttleTime} from 'rxjs/operators';
import Reference = firebase.database.Reference;
import * as firebase from 'firebase/app';
import {SharedQuery} from '../../app/state/shared.state';
import {ApplicationState} from '../../app/state/app.state';
import {Store} from '@ngrx/store';

/**
 * Services related to the withdrawals in the cellar.
 */
@Injectable()
export class FirebaseWithdrawalsService {

  private USER_ROOT: string;
  private WITHDRAW_ROOT: string;

  private withdrawRootRef: Reference;

  constructor(private withdrawalFactory: WithdrawalFactory,
              private angularFirebase: AngularFireDatabase,
              private notificationService: NotificationService, @Inject('GLOBAL_CONFIG') private config,
              private store: Store<ApplicationState>) {
    store.select(SharedQuery.getLoginUser).pipe(
      filter(user => user != null),
      take(1)
    ).subscribe(
      (user: User) => this.initialize(user)
    );
  }

  initialize(user: User) {
    let userRoot = user.user;
    this.WITHDRAW_ROOT = schema.USERS_FOLDER + '/' + userRoot + '/' + schema.WITHDRAW_FOLDER;

    this.withdrawRootRef = this.angularFirebase.database.ref(this.WITHDRAW_ROOT);
  }

  cleanup() {
    this.USER_ROOT = undefined;
    this.WITHDRAW_ROOT = undefined;
  }

  // chargement
  fetchAllWithdrawals(nb: number = 10): Observable<Withdrawal[]> {
    return this.angularFirebase
      .list<Withdrawal>(this.WITHDRAW_ROOT).snapshotChanges().pipe(
        throttleTime(this.config.throttleTime),
        map((changes: SnapshotAction<Withdrawal>[]) => {
              let ret = changes.map(
                // ATTENTION l'ordre de ...c.payload.val() et id est important. Dans l'autre sens l'id est écrasé !
                c => this.withdrawalFactory.create({
                                                     ...c.payload.val(), id: c.payload.key
                                                   })
              );
              return ret;
            }
        ),
        map((withdrawals: Withdrawal[]) => {
              let ret = withdrawals.sort((w1, w2) => {
                return w2.lastUpdated - w1.lastUpdated;
              }).slice(0, nb);
              return ret;
            }
        ),
        tap(withdrawals => {
          logInfo('[firebase] ===> réception des retraits ' + withdrawals.length);
        })
      );
  }

  // sauvegarde d'un retrait
  saveWithdrawal(withdrawal: Withdrawal): Observable<Withdrawal> {
    logInfo('[firebase] ===> sauvegarde d\'un retrait');
    this.withdrawRootRef.push(tools.sanitizeBeforeSave(withdrawal), (
      err => {
        if (err !== null) {
          throwError(err);
        } else {
          this.notificationService.debugAlert('Withdrawal created ' + withdrawal.id);
        }
      }
    ));
    return of(withdrawal);
  }

  saveNotation(withdrawal: Withdrawal, notes: BottleNoting) {
    logInfo('[firebase] ===> sauvegarde d\'une notation');
    this.withdrawRootRef.child(withdrawal.id).update(
      {notation: notes},
      err => {
        if (err) {
          this.notificationService.error('Echec de mise mise à jour de la notation: ' + err);
        }
      }
    );
  }
}
