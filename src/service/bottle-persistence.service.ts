/**
 * Created by loicsalou on 28.02.17.
 */
import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {Bottle, Position} from '../model/bottle';
import {Observable, BehaviorSubject, Subscription, Subject} from 'rxjs';
import {FilterSet} from '../components/distribution/filterset';
import {AbstractPersistenceService} from './abstract-persistence.service';
import {NotificationService} from './notification.service';
import {FirebaseAdminService} from './firebase/firebase-admin.service';
import {User} from '../model/user';
import {Locker} from '../model/locker';
import {TranslateService} from '@ngx-translate/core';
import {BottleFactory} from '../model/bottle.factory';
import {BottleNoting} from '../components/bottle-noting/bottle-noting.component';
import {Withdrawal} from '../model/withdrawal';
import {FirebaseWithdrawalsService} from './firebase/firebase-withdrawals.service';
import {FirebaseBottlesService} from './firebase/firebase-bottles.service';
import {FirebaseLockersService} from './firebase/firebase-lockers.service';
import {FirebaseImagesService} from './firebase/firebase-images.service';
import {of} from 'rxjs';
import {map, take, tap} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../app/state/app.state';
import {LockerFactory} from '../model/locker.factory';
import * as _ from 'lodash';
import {BottlesQuery} from '../app/state/bottles.state';

/**
 * Services related to the bottles in the cellar.
 * The subregion_label below are duplicated in the code of france.component.html as they are emitted when end-user
 * clicks on a region to filter bottles. Any change on either side must be propagated on the other side.
 */
@Injectable()
export class BottlePersistenceService extends AbstractPersistenceService implements OnDestroy {
  private _bottles: BehaviorSubject<Bottle[]> = new BehaviorSubject<Bottle[]>([]);
  private _allBottlesObservable: Observable<Bottle[]> = this._bottles.asObservable();
  private _filteredBottles: BehaviorSubject<Bottle[]> = new BehaviorSubject<Bottle[]>([]);
  private _filteredBottlesObservable: Observable<Bottle[]> = this._filteredBottles.asObservable();
  private filters: FilterSet = new FilterSet();

  constructor(private dataConnection: FirebaseAdminService,
              private bottlesService: FirebaseBottlesService,
              private imagesService: FirebaseImagesService,
              private lockersService: FirebaseLockersService,
              private lockerFactory: LockerFactory,
              private withdrawalService: FirebaseWithdrawalsService,
              notificationService: NotificationService,
              private bottleFactory: BottleFactory,
              translateService: TranslateService,
              store: Store<ApplicationState>) {
    super(notificationService, translateService, store);
    this.subscribeLogin();
  }

  get allBottlesObservable(): Observable<Bottle[]> {
    return this._allBottlesObservable;
  }

  get filteredBottlesObservable(): Observable<Bottle[]> {
    return this._filteredBottlesObservable;
  }

  ngOnDestroy() {
    if (this.dataConnection) {
      this.dataConnection.cleanup();
    }
  }

  update(bottles: Bottle[]): Observable<Bottle[]> {
    const uniqueBottles = _.uniqBy(bottles, 'id');
    return this.bottlesService.update(bottles.map((btl: Bottle) => {
      let updatedBottle = new Bottle(btl);
      updatedBottle.lastUpdated = new Date().getTime();
      updatedBottle.positions = updatedBottle.positions.filter(pos => pos.lockerId !== undefined);
      return updatedBottle;
    }));
  }

  updateLockerAndBottles(bottles: Bottle[], locker: Locker): Observable<{ bottles: Bottle[], locker: Locker }> {
    return this.bottlesService.updateLockerAndBottles(bottles, locker).pipe(
      map((updates: { bottles: Bottle[], locker: Locker }) => {
        return {...updates, locker: this.lockerFactory.create(updates.locker)};
      })
    );
  }

  save(bottles: Bottle[]): Observable<Bottle[]> {
    return this.bottlesService.saveBottles(bottles);
  }

  deleteBottles(): Observable<boolean> {
    return this.bottlesService.deleteBottles();
  }

  getBottlesInLocker(locker: Locker): Observable<Bottle[]> {
    return this.store.select(BottlesQuery.getBottles).pipe(
      take(1),
      tap((allBottlesArray: Bottle[]) => allBottlesArray.filter(
        bottle => bottle.positions.filter(pos => pos.lockerId === locker.id).length > 0)
      ));
  }

  /**
   * creates a clean bottle starting from any bottle-like structured Data
   * @param {Bottle} btl
   * @returns {Bottle}
   */
  saveBottle(btl: Bottle): Bottle {
    return this.bottleFactory.create(btl);
  }

  removeFromQueryStats(keywords: any) {
    this.dataConnection.removeFromQueryStats(keywords);
  }

  deleteAccountData(): Observable<boolean> {
    this.notificationService.error('Opération bloquée');
    return of(false);
    //let sub = new Subject<boolean>();
    //this.notificationService.ask('question', 'app.keep-or-delete-data').pipe(take(1)).subscribe(
    //  resp => {
    //    if (resp) {
    //      this.dataConnection.deleteAccount().pipe(take(1)).subscribe(
    //        result => sub.next(result)
    //      );
    //    }
    //  }
    //);
    //return sub.asObservable();
  }

  createWithdrawal(bottle: Bottle): Withdrawal {
    return new Withdrawal(bottle);
  }

  removeBottleFrom(bottle: Bottle, position: Position): Bottle {
    let updatedBottle=new Bottle(bottle);
    updatedBottle.positions=bottle.positions.filter(pos => !pos.equals(position));
    updatedBottle.quantite_courante--;
    return updatedBottle;
  }

  saveWithdrawal(withdrawal: Withdrawal): Observable<Withdrawal> {
    return this.withdrawalService.saveWithdrawal(withdrawal);
  }

  saveBottleNotation(bottle: Bottle, notes: BottleNoting) {
    let withdrawal = new Withdrawal(bottle, notes);
    this.withdrawalService.saveNotation(withdrawal, notes);
  }

  fetchAllWithdrawals(): Observable<Withdrawal[]> {
    return this.withdrawalService.fetchAllWithdrawals();
  }

  deleteLogs() {
    this.dataConnection.deleteLogs();
  }

  loadAllBottles(): Observable<Bottle[]> {
    return this.bottlesService.fetchAllBottlesFromDB();
  }

  disconnectListeners() {
    this.notificationService.error('Déconnection de la DB à réimplémenter');
  }

  reconnectListeners() {
    this.notificationService.error('Reconnection de la DB à réimplémenter');
  }

  protected initialize(user: User) {
    super.initialize(user);
    this.bottlesService.initialize(user);
    this.dataConnection.initialize(user);
    this.lockersService.initialize(user);
    this.imagesService.initialize(user);
    this.withdrawalService.initialize(user);
  }

  protected cleanup() {
    super.cleanup();
    this.filters = undefined;
  }
}


