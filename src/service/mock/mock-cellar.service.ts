/**
 * Created by loicsalou on 28.02.17.
 */
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {LoadingController} from 'ionic-angular';
import {BottleSize, Locker, LockerMaterial, LockerType} from '../../model/locker';
import {LockerFactory} from '../../model/locker.factory';
import {NotificationService} from '../notification.service';
import {LoginService} from '../login.service';
import {CellarService} from '../cellar.service';

/**
 * Services related to the cellar itself, locker and place of the lockers.
 * The subregion_label below are duplicated in the code of france.component.html as they are emitted when end-user
 * clicks on a region to filter lockers. Any change on either side must be propagated on the other side.
 */
@Injectable()
export class MockCellarService implements CellarService {
  private _lockers: BehaviorSubject<Locker[]> = new BehaviorSubject<Locker[]>([]);
  private _allLockersObservable: Observable<Locker[]> = this._lockers.asObservable();
  private allLockersArray: Locker[]=[];

  constructor(private loadingCtrl: LoadingController,
              private lockerFactory: LockerFactory,
              private notificationService: NotificationService,
              private loginService: LoginService) {
    this.initMocks();
  }

  public fetchAllLockers() {
    this._lockers.next(this.allLockersArray);
  }

  get allLockersObservable(): Observable<Locker[]> {
    return this._allLockersObservable;
  }

  private initMocks() {
    let locker: Locker = {
      name: 'casier 1',
      type: LockerType.simple, // frigo, étagère, filaire...
      material: LockerMaterial.polystyrene, //utile ? texture plutôt ? à voir
      dimensions: {
        x: 6,
        y: 10
      },
      defaultImage: '', // une image par défaut si par d'imageUrl
      bottleSizeCompatibility: [
        BottleSize.normale,
        BottleSize.clavelin
      ],
      comment: 'casier numéro 1',

      getDefaultImageSrc(): string {
        return this.defaultImage;
      }
    };
    let locker2: Locker = {
      name: 'Frigo',
      type: LockerType.double, // frigo, étagère, filaire...
      material: LockerMaterial.fridge, //utile ? texture plutôt ? à voir
      dimensions: {
        x: 6,
        y: 10
      },
      defaultImage: '', // une image par défaut si par d'imageUrl
      bottleSizeCompatibility: [
        BottleSize.normale,
        BottleSize.clavelin,
        BottleSize.demie
      ],
      comment: 'Frigo cave',

      getDefaultImageSrc(): string {
        return this.defaultImage;
      }
    };
    let locker3: Locker = {
      name: 'Grand rangement',
      type: LockerType.shifted, // frigo, étagère, filaire...
      material: LockerMaterial.polystyrene, //utile ? texture plutôt ? à voir
      dimensions: {
        x: 16,
        y: 12
      },
      defaultImage: '', // une image par défaut si par d'imageUrl
      bottleSizeCompatibility: [
        BottleSize.normale,
        BottleSize.clavelin,
        BottleSize.demie
      ],
      comment: 'Empilement de cellules polystyrène',

      getDefaultImageSrc(): string {
        return this.defaultImage;
      }
    };
    this.allLockersArray.push(locker);
    this.allLockersArray.push(locker2);
    this.allLockersArray.push(locker3);
  }
}


