/**
 * Created by loicsalou on 28.02.17.
 */
import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {Bottle, Position} from '../model/bottle';
import {Observable} from 'rxjs';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {FilterSet} from '../components/distribution/filterset';
import {AbstractPersistenceService} from './abstract-persistence.service';
import {NotificationService} from './notification.service';
import {FirebaseAdminService} from './firebase/firebase-admin.service';
import {User} from '../model/user';
import {Subscription} from 'rxjs/Subscription';
import {Locker} from '../model/locker';
import {TranslateService} from '@ngx-translate/core';
import {BottleFactory} from '../model/bottle.factory';
import {Subject} from 'rxjs/Subject';
import {BottleNoting} from '../components/bottle-noting/bottle-noting.component';
import {Withdrawal} from '../model/withdrawal';
import {FirebaseWithdrawalsService} from './firebase/firebase-withdrawals.service';
import {FirebaseBottlesService} from './firebase/firebase-bottles.service';
import {FirebaseLockersService} from './firebase/firebase-lockers.service';
import {FirebaseImagesService} from './firebase/firebase-images.service';
import {map, tap} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../app/state/app.state';
import {LockerFactory} from '../model/locker.factory';
import * as _ from 'lodash';

/**
 * Services related to the bottles in the cellar.
 * The subregion_label below are duplicated in the code of france.component.html as they are emitted when end-user
 * clicks on a region to filter bottles. Any change on either side must be propagated on the other side.
 */
@Injectable()
export class BottlePersistenceService extends AbstractPersistenceService implements OnInit, OnDestroy {
  private _bottles: BehaviorSubject<Bottle[]> = new BehaviorSubject<Bottle[]>([]);
  private _allBottlesObservable: Observable<Bottle[]> = this._bottles.asObservable();
  private _filteredBottles: BehaviorSubject<Bottle[]> = new BehaviorSubject<Bottle[]>([]);
  private _filteredBottlesObservable: Observable<Bottle[]> = this._filteredBottles.asObservable();
  private filters: FilterSet = new FilterSet();
  private allBottlesArray: Bottle[];
  private bottlesSub: Subscription;

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

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.bottlesSub) {
      this.bottlesSub.unsubscribe();
    }
    if (this.dataConnection) {
      this.dataConnection.cleanup();
    }
  }

  public update(bottles: Bottle[]): Observable<Bottle[]> {
    const uniqueBottles = _.uniqBy(bottles, 'id');
    return this.bottlesService.update(bottles.map((btl: Bottle) => {
      let updatedBottle = new Bottle(btl);
      updatedBottle.lastUpdated = new Date().getTime();
      updatedBottle.positions = updatedBottle.positions.filter(pos => pos.lockerId !== undefined);
      return updatedBottle;
    })).pipe(
      tap((bottles: Bottle[]) =>
            this.notificationService.information('update.saved'))
    );
  }

  public updateLockerAndBottles(bottles: Bottle[], locker: Locker): Observable<{ bottles: Bottle[], locker: Locker }> {
    return this.bottlesService.updateLockerAndBottles(bottles, locker).pipe(
      map((updates: { bottles: Bottle[], locker: Locker }) => {
        return {...updates, locker: this.lockerFactory.create(updates.locker)};
      })
    );
  }

  public save(bottles: Bottle[]): Observable<Bottle[]> {
    return this.bottlesService.saveBottles(bottles);
  }

  public deleteBottles(): Observable<boolean> {
    return this.bottlesService.deleteBottles();
  }

  public getBottlesInLocker(locker: Locker): Bottle[] {
    return this.allBottlesArray.filter(
      bottle => bottle.positions.filter(pos => pos.lockerId === locker.id).length > 0
    );
  }

  /**
   * creates a clean bottle starting from any bottle-like structured Data
   * @param {Bottle} btl
   * @returns {Bottle}
   */
  public createBottle(btl: Bottle): Bottle {
    return this.bottleFactory.create(btl);
  }

  removeFromQueryStats(keywords: any) {
    this.dataConnection.removeFromQueryStats(keywords);
  }

  deleteAccountData(): Observable<boolean> {
    let sub = new Subject<boolean>();
    this.notificationService.ask('question', 'app.keep-or-delete-data').take(1).subscribe(
      resp => {
        if (resp) {
          this.dataConnection.deleteAccount().take(1).subscribe(
            result => sub.next(result)
          );
        }
      }
    );
    return sub.asObservable();
  }

  withdraw(bottle: Bottle, position: Position) {
    this.withdrawalService.withdraw(bottle, position);
  }

  recordBottleNotation(bottle: Bottle, notes: BottleNoting) {
    let withdrawal = new Withdrawal(bottle, notes);
    this.recordWidthdrawNotation(withdrawal, notes);
  }

  recordWidthdrawNotation(withdrawal: Withdrawal, notes: BottleNoting) {
    this.withdrawalService.recordNotation(withdrawal, notes);
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
    this.allBottlesArray = undefined;
    this.filters = undefined;
  }
}


