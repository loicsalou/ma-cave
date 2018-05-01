/**
 * Created by loicsalou on 28.02.17.
 */
import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {Bottle, Position} from '../model/bottle';
import {Observable} from 'rxjs';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {FilterSet} from '../components/distribution/filterset';
import {LoginService} from './login/login.service';
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
import {tap} from 'rxjs/operators';

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
  private _filtersObservable: BehaviorSubject<FilterSet>;

  constructor(private dataConnection: FirebaseAdminService,
              private bottlesService: FirebaseBottlesService,
              private imagesService: FirebaseImagesService,
              private lockersService: FirebaseLockersService,
              private withdrawalService: FirebaseWithdrawalsService,
              notificationService: NotificationService,
              loginService: LoginService, private bottleFactory: BottleFactory,
              translateService: TranslateService) {
    super(notificationService, loginService, translateService);
    this._filtersObservable = new BehaviorSubject<FilterSet>(new FilterSet());
    if (loginService.user) {
      this.initialize(loginService.user);
    }
  }

  get allBottlesObservable(): Observable<Bottle[]> {
    return this._allBottlesObservable;
  }

  get filteredBottlesObservable(): Observable<Bottle[]> {
    return this._filteredBottlesObservable;
  }

  get filtersObservable(): Observable<FilterSet> {
    return this._filtersObservable.asObservable();
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
    return this.bottlesService.update(bottles.map((btl: Bottle) => {
      let updatedBottle = new Bottle(btl);
      updatedBottle.lastUpdated = new Date().getTime();
      updatedBottle.positions = updatedBottle.positions.filter(pos => pos.lockerId !== undefined);
      delete updatedBottle.selected;
      return updatedBottle;
    })).pipe(
      tap((bottles: Bottle[]) =>
            this.notificationService.information('update.saved'))
    );
  }

  public updateLockerAndBottles(bottles: Bottle[], locker: Locker) {
    this.bottlesService.updateLockerAndBottles(bottles, locker);
  }

  public save(bottles: Bottle[]): Observable<Bottle[]> {
    return this.bottlesService.saveBottles(bottles);
  }

  public deleteBottles(): Observable<boolean> {
    return this.bottlesService.deleteBottles();
  }

  public getBottle(id: string): Bottle {
    return this.allBottlesArray.find(btl => btl.id === id);
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

  /**
   * durant un import on coupe la souscription pour éviter les cascades d'événements
   */
  public disconnectListeners() {
    this.bottlesService.disconnectListeners();
  }

  /**
   * après un import on rebranche la souscription pour éviter les cascades d'événements
   */
  public reconnectListeners() {
    this.bottlesService.reconnectListeners();
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
    return this.bottlesService.allBottlesObservable;
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


