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
import {TranslateService} from '@ngx-translate/core';

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
              translateService: TranslateService,
              loginService: LoginService) {
    super(notificationService, loginService, translateService);
    if (loginService.user) {
      this.initialize(loginService.user);
    }
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

  private fetchAllLockers() {
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
    this.sanitize(locker);
    try {
      this.dataConnection.createLocker(locker);
    } catch (err) {
      this.notificationService.error('La création du casier a échoué', err)
    }
  }

  private sanitize(locker: Locker) {
    locker.dimension = {x: +locker.dimension.x, y: +locker.dimension.y};
    if (locker[ 'dimensions' ]) {
      locker[ 'dimensions' ] = locker[ 'dimensions' ].map(
        dim => {
          return { x: +dim.x, y: +dim.y }
        }
      )
    }
  }

  public replaceLocker(locker: SimpleLocker) {
    locker[ 'lastUpdated' ] = new Date().getTime();
    this.dataConnection.replaceLocker(locker);
  }

  public deleteLocker(locker: Locker) {
    if (this.isEmpty(locker)) {
      this.dataConnection.deleteLocker(locker);
      this.notificationService.information('Le casier "' + locker.name + '" a bien été supprimé')
    } else {
      this.notificationService.warning('Le casier "' + locker.name + '" n\'est pas vide et ne peut donc pas' +
        ' être supprimé');
    }
  }

  private resolveBottles(bottleIds: string[]): Observable<Bottle[]> {
    let bottles: Bottle[] = bottleIds.map(id => this.resolveBottle(id)).filter(btl => btl !== undefined);
    return Observable.create(observer => observer.next(bottles));
  }

  private resolveBottle(id: string): Bottle {
    return this.bottleService.getBottle(id);
  }

  public isEmpty(locker: Locker) {
    return this.bottleService.getBottlesInLocker(locker).length === 0;
  }
}


