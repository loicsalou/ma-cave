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

  constructor() {
    this.initMocks();
  }

  public fetchAllLockers() {
    this._lockers.next(this.allLockersArray);
  }

  get allLockersObservable(): Observable<SimpleLocker[]> {
    return this._allLockersObservable;
  }

  private initMocks() {
    let locker = new SimpleLocker('casier 1',
                                  LockerType.simple,
                                  {
                                    x: 12,
                                    y: 10,
                                  },
                                  'casier numéro 1',
    );
    let locker2 = new FridgeLocker(
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
    let locker3 = new SimpleLocker('Grand rangement',
                                   LockerType.shifted,
                                   {
                                     x: 16,
                                     y: 20,
                                   },
                                   'Empilement de cellules polystyrène',
    );

    this.allLockersArray.push(locker);
    this.allLockersArray.push(locker2);
    this.allLockersArray.push(locker3);
  }
}


