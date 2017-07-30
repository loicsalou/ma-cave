/**
 * Created by loicsalou on 28.02.17.
 */
import {Injectable} from '@angular/core';
import {SimpleLocker} from '../model/simple-locker';
import {Observable} from 'rxjs';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {LockerFactory} from '../model/locker.factory';
import {LoginService} from './login.service';
import {PersistenceService} from './persistence.service';
import {NotificationService} from './notification.service';
import {CellarService} from './cellar.service';
import {Locker} from '../model/locker';
import {FirebaseConnectionService} from './firebase-connection.service';
import {Bottle} from '../model/bottle';
import {BottlePersistenceService} from './bottle-persistence.service';

/**
 * Services related to the cellar itself, locker and place of the lockers.
 * The subregion_label below are duplicated in the code of france.component.html as they are emitted when end-user
 * clicks on a region to filter lockers. Any change on either side must be propagated on the other side.
 */
@Injectable()
export class CellarPersistenceService extends PersistenceService implements CellarService {

  private _lockers: BehaviorSubject<Locker[]> = new BehaviorSubject<Locker[]>([]);
  private _allLockersObservable: Observable<Locker[]> = this._lockers.asObservable();
  private allLockersArray: Locker[];

  constructor(private dataConnection: FirebaseConnectionService,
              private lockerFactory: LockerFactory,
              notificationService: NotificationService,
              private bottleService: BottlePersistenceService,
              loginService: LoginService) {
    super(notificationService, loginService);
  }

  get allLockersObservable(): Observable<Locker[]> {
    return this._allLockersObservable;
  }

  initialize(user) {
    super.initialize(user);
    this.fetchAllLockers();
  }

  cleanup() {
    super.cleanup();
    this.allLockersArray = undefined;
  }

  public fetchAllLockers() {
    this.dataConnection.allLockersObservable.subscribe(
      (lockers: Locker[]) => {
        this.allLockersArray = lockers.map((locker: Locker) => this.lockerFactory.create(locker));
        this._lockers.next(this.allLockersArray);
      }
    );
    this.dataConnection.fetchAllLockers();
  }

  createLocker(locker: Locker): void {
    locker[ 'lastUpdated' ] = new Date().getTime();
    try {
      this.dataConnection.createLocker(locker);
    } catch (err) {
      this.notificationService.error('La création du casier a échoué', err)
    }
  }

  public replaceLocker(locker: SimpleLocker) {
    locker[ 'lastUpdated' ] = new Date().getTime();
    this.dataConnection.replaceLocker(locker);
  }

  public deleteLocker(locker: Locker) {
    this.dataConnection.deleteLocker(locker);
  }

  public fetchLockerContent(locker: Locker): Observable<Bottle[]> {
    return this.dataConnection.fetchLockerContent(locker)
      .concatMap((bottleIds: string[]) => this.resolveBottles(bottleIds));
  }

  private resolveBottles(bottleIds: string[]): Observable<Bottle[]> {
    let bottles: Bottle[] = bottleIds.map(id => this.resolveBottle(id)).filter(btl => btl!==undefined);
    return Observable.create(observer => observer.next(bottles));
  }

  private resolveBottle(id: string): Bottle {
    return this.bottleService.getBottle(id);
  }
}


