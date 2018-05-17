
import {map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Bottle, Position} from '../../model/bottle';
import {Observable} from 'rxjs';
import {AngularFireDatabase, SnapshotAction} from 'angularfire2/database';
import {NotificationService} from '../notification.service';
import {WithdrawalFactory} from '../../model/withdrawal.factory';
import {User} from '../../model/user';
import {Withdrawal} from '../../model/withdrawal';
import {BottleNoting} from '../../components/bottle-noting/bottle-noting.component';

import * as firebase from 'firebase/app';
import * as schema from './firebase-schema';
import * as tools from '../../utils/index';
import Reference = firebase.database.Reference;

/**
 * Services related to the withdrawals in the cellar.
 */
@Injectable()
export class FirebaseWithdrawalsService {

  private USER_ROOT: string;
  private BOTTLES_ROOT: string;
  private userRootRef: Reference;
  private bottlesRootRef: Reference;

  private WITHDRAW_ROOT: string;
  private withdrawRootRef: Reference;

  constructor(private withdrawalFactory: WithdrawalFactory,
              private angularFirebase: AngularFireDatabase,
              private notificationService: NotificationService) {
  }

  public initialize(user: User) {
    let userRoot = user.user;
    this.USER_ROOT = schema.USERS_FOLDER + '/' + userRoot;
    this.BOTTLES_ROOT = schema.USERS_FOLDER + '/' + userRoot + '/' + schema.BOTTLES_FOLDER;
    this.WITHDRAW_ROOT = schema.USERS_FOLDER + '/' + userRoot + '/' + schema.WITHDRAW_FOLDER;

    this.userRootRef = this.angularFirebase.database.ref(this.USER_ROOT);
    this.bottlesRootRef = this.angularFirebase.database.ref(this.BOTTLES_ROOT);
    this.withdrawRootRef = this.angularFirebase.database.ref(this.WITHDRAW_ROOT);
  }

  public cleanup() {
    this.USER_ROOT = undefined;
    this.WITHDRAW_ROOT = undefined;
  }

  // ===================================================== WITHDRAWS
  public withdraw(bottle: Bottle, position: Position): Promise<any> {
    return new Promise((resolve, reject) => {
      let updatedBottle=new Bottle(bottle);
      updatedBottle.positions=bottle.positions.filter(pos => !pos.equals(position));
      updatedBottle.quantite_courante--;
      updatedBottle[ 'lastUpdated' ] = new Date().getTime();
      this.update([ updatedBottle ]).then(
        err => {
          if (err == null) {
            let withdrawal = new Withdrawal(updatedBottle);
            this.createWithdrawal(withdrawal);
          } else {
            this.notificationService.debugAlert('mise à jour KO ' + err);
            reject(err);
          }
        }
      );
    });
  }

  public fetchAllWithdrawals(): Observable<Withdrawal[]> {
    return this.angularFirebase
      .list<Withdrawal>(this.WITHDRAW_ROOT).snapshotChanges().pipe(
      map((changes: SnapshotAction<Withdrawal>[]) =>
             changes.map(
               // ATTENTION l'ordre de ...c.payload.val() et id est important. Dans l'autre sens l'id est écrasé !
               c => this.withdrawalFactory.create({
                                                    ...c.payload.val(), id: c.payload.key
                                                  })
             )
      ));
  }

  public createWithdrawal(withdrawal: Withdrawal): void {
    this.withdrawRootRef.push(tools.sanitizeBeforeSave(withdrawal), (
      err => {
        if (err !== null) {
          throw err;
        } else {
          this.notificationService.debugAlert('Withdrawal created ' + withdrawal.id);
        }
      }
    ));
  }

  recordNotation(withdrawal: Withdrawal, notes: BottleNoting) {
    this.userRootRef.child(schema.WITHDRAW_FOLDER).child(withdrawal.id).update(
      {notation: notes},
      err => {
        if (err) {
          this.notificationService.error('Echec de mise mise à jour de la notation: ' + err);
        }
      }
    );
  }

  private update(bottles: Bottle[ ]): Promise<any> {
    return new Promise((resolve, reject) => {
      let updates = {};
      bottles.forEach(bottle => {
        bottle[ 'lastUpdated' ] = new Date().getTime();
        updates[ '/' + bottle.id ] = tools.sanitizeBeforeSave(bottle);
      });
      this.bottlesRootRef.update(updates, (
        err => {
          if (err == null) {
            this.notificationService.debugAlert('mise à jour OK');
            resolve(null);
          } else {
            this.notificationService.debugAlert('mise à jour KO ' + err);
            reject(err);
          }
        }
      ));
    });
  }
}
