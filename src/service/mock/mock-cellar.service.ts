/**
 * Created by loicsalou on 28.02.17.
 */
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {CellarService} from '../cellar.service';
import {FridgeLocker} from '../../model/fridge-locker';
import {SimpleLocker} from '../../model/simple-locker';
import {Locker, LockerType} from '../../model/locker';
import {NotificationService} from '../notification.service';

/**
 * Services related to the cellar itself, locker and place of the lockers.
 * The subregion_label below are duplicated in the code of france.component.html as they are emitted when end-user
 * clicks on a region to filter lockers. Any change on either side must be propagated on the other side.
 */
@Injectable()
export class MockCellarService implements CellarService {

  private _lockers: BehaviorSubject<Locker[]> = new BehaviorSubject<Locker[]>([]);
  private _allLockersObservable: Observable<Locker[]> = this._lockers.asObservable();
  private allLockersArray: Locker[] = [];

  constructor(private notificationService: NotificationService) {
    this.initMocks();
  }

  createLocker(locker: Locker): void {
    this.notificationService.information('Cellar mock service aucune mise à jour implémentée');
  }

  public fetchAllLockers() {
    this._lockers.next(this.allLockersArray);
  }

  get allLockersObservable(): Observable<SimpleLocker[]> {
    return this._allLockersObservable;
  }

  replaceLocker(locker: Locker) {
    throw new Error('Method not implemented.');
  }

  deleteLocker(locker: Locker) {
    throw new Error('Method not implemented.');
  }

  private initMocks() {
    let locker = new SimpleLocker('mock-id1', 'casier 1',
                                  LockerType.simple,
                                  {
                                    x: 12,
                                    y: 10,
                                  },
                                  false,
                                  'casier numéro 1',
    );
    let locker2 = new FridgeLocker('mock-id2',
                                   'Frigo',
      LockerType.fridge, // frigo, étagère, filaire...
      [
        {
          x: 6,
          y: 2
        },
        {
          x: 6,
          y: 4
        },
        {
          x: 6,
          y: 5
        },
        {
          x: 6,
          y: 3
        },
        {
          x: 6,
          y: 2
        }
      ],
      'Frigo cave'
    );
    let locker3 = new SimpleLocker('mock-id3', 'Grand rangement',
                                   LockerType.shifted,
                                   {
                                     x: 16,
                                     y: 20,
                                   },
                                   false,
                                   'Empilement de cellules polystyrène',
    );

    this.allLockersArray.push(locker);
    this.allLockersArray.push(locker2);
    this.allLockersArray.push(locker3);
  }
}


