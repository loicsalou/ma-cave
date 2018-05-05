/**
 * Created by loicsalou on 28.02.17.
 */
import {Injectable} from '@angular/core';
import {SimpleLocker} from '../model/simple-locker';
import {Observable} from 'rxjs';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {LockerFactory} from '../model/locker.factory';
import {AbstractPersistenceService} from './abstract-persistence.service';
import {NotificationService} from './notification.service';
import {Locker} from '../model/locker';
import {BottlePersistenceService} from './bottle-persistence.service';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs/Subscription';
import {FirebaseLockersService} from './firebase/firebase-lockers.service';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../app/state/app.state';

/**
 * Services related to the cellar itself, locker and place of the lockers.
 * The subregion_label below are duplicated in the code of france.component.html as they are emitted when end-user
 * clicks on a region to filter lockers. Any change on either side must be propagated on the other side.
 */
@Injectable()
export class CellarPersistenceService extends AbstractPersistenceService {

  private _lockers: BehaviorSubject<Locker[]> = new BehaviorSubject<Locker[]>([]);
  private _allLockersObservable: Observable<Locker[]> = this._lockers.asObservable();

  private allLockersArray: Locker[];
  private lockersSubscription: Subscription;

  // TODO supprimer bottleService quand NGRX fournira le bon sélecteur
  constructor(private firebaseLockersService: FirebaseLockersService,
              private lockerFactory: LockerFactory,
              notificationService: NotificationService,
              private bottleService: BottlePersistenceService,
              translateService: TranslateService,
              store: Store<ApplicationState>) {
    super(notificationService, translateService, store);
    this.subscribeLogin();
  }

  get allLockersObservable(): Observable<Locker[]> {
    return this._allLockersObservable;
  }

  createLocker(locker: Locker): void {
    locker[ 'lastUpdated' ] = new Date().getTime();
    sanitize(locker);
    try {
      this.firebaseLockersService.createLocker(locker);
    } catch (err) {
      this.notificationService.error('La création du casier a échoué', err);
    }
  }

  public replaceLocker(locker: SimpleLocker) {
    locker[ 'lastUpdated' ] = new Date().getTime();
    this.firebaseLockersService.replaceLocker(locker);
  }

  public deleteLocker(locker: Locker) {
    if (this.isEmpty(locker)) {
      this.firebaseLockersService.deleteLocker(locker);
      this.notificationService.information('Le casier "' + locker.name + '" a bien été supprimé');
    } else {
      this.notificationService.warning('Le casier "' + locker.name + '" n\'est pas vide et ne peut donc pas' +
        ' être supprimé');
    }
  }

  // TODO remplacer pas un selecteur NGRX
  public isEmpty(locker: Locker) {
    return this.bottleService.getBottlesInLocker(locker).length === 0;
  }

  protected initialize(user) {
    super.initialize(user);
    this.initLockers();
  }

  protected cleanup() {
    super.cleanup();
    this.allLockersArray = undefined;
    this.lockersSubscription.unsubscribe();
  }

  private initLockers() {
    this.lockersSubscription = this.firebaseLockersService.fetchAllLockers().subscribe(
      (lockers: Locker[]) => {
        this.allLockersArray = lockers.map((locker: Locker) => this.lockerFactory.create(locker));
        this._lockers.next(this.allLockersArray);
      }
    );
  }
}

export function sanitize(locker: Locker): Locker {
  locker.dimension = {x: +locker.dimension.x, y: +locker.dimension.y};
  if (locker[ 'dimensions' ]) {
    locker[ 'dimensions' ] = locker[ 'dimensions' ].map(
      dim => {
        return {x: +dim.x, y: +dim.y};
      }
    );
  }
  return locker;
}
