/**
 * Created by loicsalou on 28.02.17.
 */

import {Injectable} from '@angular/core';
import {Bottle} from '../../model/bottle';
import {Observable} from 'rxjs';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Image} from '../../model/image';
import {NotificationService} from '../notification.service';
import {BottleFactory} from '../../model/bottle.factory';
import {User} from '../../model/user';
import {Locker} from '../../model/locker';
import {HttpClient} from '@angular/common/http';

/**
 * Services related to the bottles in the cellar.
 * The subregion_label below are duplicated in the code of france.component.html as they are emitted when end-user
 * clicks on a region to filter bottles. Any change on either side must be propagated on the other side.
 */
@Injectable()
export class MockBottlesService {
  private _allBottlesObservable: Observable<Bottle[]>;
  private _bottles: BehaviorSubject<Bottle[]>;

  constructor(private bottleFactory: BottleFactory,
              private http: HttpClient,
              private notificationService: NotificationService) {
  }

  get allBottlesObservable(): Observable<Bottle[ ]> {
    this._bottles = new BehaviorSubject<Bottle[]>([]);
    this._allBottlesObservable = this._bottles.asObservable();
    return this._allBottlesObservable;
  }

  public initialize(user: User) {
  }

  public cleanup() {
  }

// ===================================================== BOTTLES

  public fetchAllBottles() {
    this.fetchAllBottlesFromDB();
  }

  //============================= Image management
  /**
   * list images in Firebase Storage
   * @param {Bottle} bottle
   * @returns {Observable<Image[]>}
   */
  public listBottleImages(bottle: Bottle): Observable<Image[ ]> {
    return Observable.of([]);
  }

  // ======================== Gestion des bouteilles
  update(bottles: Bottle[ ]): Promise<any> {
    this.notificationService.notImplementedInMock('update');
    return new Promise((resolve, reject) => {
      resolve(bottles);
    });
  }

  /**
   * Transaction de mise à jour d'un casier et de son contenu. Soit toute la mise é jour est faite soit rien n'est
   * mis à jour, ce afin de préserver la cohérence des données.
   * @param {Bottle[]} bottles bouteilles du casier
   * @param {Locker} locker casier contenant les bouteilles
   * @returns {Promise<any>}
   */
  updateLockerAndBottles(bottles: Bottle[ ], locker: Locker): Promise<any> {
    this.notificationService.notImplementedInMock('updateLockerAndBottles');
    return new Promise((resolve, reject) => {
      resolve(bottles);
    });
  }

  saveBottles(bottles: Bottle[ ]): Promise<any> {
    this.notificationService.notImplementedInMock('saveBottles');
    return new Promise((resolve, reject) => {
      resolve(bottles);
    });
  }

  replaceBottle(bottle: Bottle) {
    this.notificationService.notImplementedInMock('replaceBottle');
  }

  deleteBottles() {
    this.notificationService.notImplementedInMock('deleteBottles');
  }

  isConnectionAllowed(): boolean {
    return false;
  }

  setConnectionAllowed(b: boolean) {
  }

  disconnectListeners() {
  }

  reconnectListeners() {
    this.fetchAllBottles();
  }

  private fetchAllBottlesFromDB() {
    let i = 0;
    this.http.get('/assets/json/ma-cave.json').subscribe(
      (rows: any[]) => {
        const bottles = rows.map(
          bottle => this.bottleFactory.create({id: i++, ...bottle})
        );
        this._bottles.next(bottles);
      },
      error => {
        this._bottles.error(error);
      },
      () => this._bottles.complete()
    );
  }
}
