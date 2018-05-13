/**
 * Created by loicsalou on 28.02.17.
 */
import {Injectable} from '@angular/core';
import {SimpleLocker} from '../model/simple-locker';
import {LockerFactory} from '../model/locker.factory';
import {AbstractPersistenceService} from './abstract-persistence.service';
import {NotificationService} from './notification.service';
import {Locker} from '../model/locker';
import {BottlePersistenceService} from './bottle-persistence.service';
import {TranslateService} from '@ngx-translate/core';
import {FirebaseLockersService} from './firebase/firebase-lockers.service';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../app/state/app.state';
import {catchError, map, tap} from 'rxjs/operators';
import {of} from 'rxjs/observable/of';
import {Bottle} from '../model/bottle';

/**
 * Services related to the cellar itself, locker and place of the lockers.
 * The subregion_label below are duplicated in the code of france.component.html as they are emitted when end-user
 * clicks on a region to filter lockers. Any change on either side must be propagated on the other side.
 */
@Injectable()
export class CellarPersistenceService extends AbstractPersistenceService {

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
    this.bottleService.getBottlesInLocker(locker).subscribe(
      (bottles: Bottle[]) => {
        if (bottles.length === 0) {
          this.firebaseLockersService.deleteLocker(locker);
          this.notificationService.information('Le casier "' + locker.name + '" a bien été supprimé');
        } else {
          this.notificationService.warning('Le casier "' + locker.name + '" n\'est pas vide et ne peut donc pas' +
            ' être supprimé');
        }
      }
    );
  }

  loadAllLockers() {
    let popup = this.notificationService.createLoadingPopup('app.loading');
    return this.firebaseLockersService.fetchAllLockers().pipe(
      map((lockers: Locker[]) => lockers.map((locker: Locker) => this.lockerFactory.create(locker))),
      tap(() => popup.dismiss()),
      catchError(err => {
        popup.dismiss();
        this.notificationService.error('app.failed');
        return of([]);
      })
    );
  }

  protected initialize(user) {
    super.initialize(user);
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
