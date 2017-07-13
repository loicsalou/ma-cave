/**
 * Created by loicsalou on 28.02.17.
 */
import {Injectable} from '@angular/core';
import {SimpleLocker} from '../model/simple-locker';
import {Observable} from 'rxjs';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {AngularFireDatabase} from 'angularfire2/database';
import {LockerFactory} from '../model/locker.factory';
import {Loading, LoadingController} from 'ionic-angular';
import * as firebase from 'firebase/app';
import {LoginService} from './login.service';
import {PersistenceService} from './persistence.service';
import {NotificationService} from './notification.service';
import {TranslateService} from '@ngx-translate/core';
import {CellarService} from './cellar.service';
import Reference = firebase.database.Reference;

/**
 * Services related to the cellar itself, locker and place of the lockers.
 * The subregion_label below are duplicated in the code of france.component.html as they are emitted when end-user
 * clicks on a region to filter lockers. Any change on either side must be propagated on the other side.
 */
@Injectable()
export class CellarPersistenceService extends PersistenceService implements CellarService {
  private CELLAR_FOLDER = 'cellar';
  private CELLAR_ROOT: string;

  private firebaseRef: Reference;
  private _lockers: BehaviorSubject<SimpleLocker[]> = new BehaviorSubject<SimpleLocker[]>([]);
  private _allLockersObservable: Observable<SimpleLocker[]> = this._lockers.asObservable();
  private allLockersArray: SimpleLocker[];

  constructor(private angularFirebase: AngularFireDatabase,
              loadingCtrl: LoadingController,
              private lockerFactory: LockerFactory,
              notificationService: NotificationService,
              loginService: LoginService,
              translateService: TranslateService) {
    super(loadingCtrl, notificationService, loginService, translateService);
  }

  initialize(user) {
    super.initialize(user);
    this.CELLAR_ROOT = this.USERS_FOLDER + '/' + this.loginService.user.user + '/' + this.CELLAR_FOLDER;
    this.firebaseRef = this.angularFirebase.database.ref(this.CELLAR_ROOT);
    this.fetchAllLockers();
  }

  cleanup() {
    super.cleanup();
    this.CELLAR_ROOT = undefined;
    this.allLockersArray = undefined;
  }

  public fetchAllLockers() {
    let popup: Loading = this.notificationService.createLoadingPopup('loading');
    try {
      let items = this.angularFirebase.list(this.CELLAR_ROOT, {
        query: {
          orderByChild: 'name',
        }
      });
      items.subscribe((lockers: SimpleLocker[]) => {
        lockers.forEach((locker: SimpleLocker) => this.lockerFactory.create(locker));
        this.setallLockersArray(lockers);
        popup.dismiss();
      });
    } catch (error) {
      popup.dismiss();
      this.handleError('Impossible de charger les casiers', error)
    }
  }

  public update(lockers: SimpleLocker[]) {
    lockers.forEach(locker => {
      this.firebaseRef.child(locker[ '$key' ]).set(locker, (
        err => {
          if (err) {
            this.notificationService.failed('La mise à jour de la bouteille a échoué !', err);
          }
        }
      ))
    })
  }

  public save(lockers: SimpleLocker[]) {
    lockers.forEach(locker => this.firebaseRef.push(locker));
  }

  public replaceLocker(locker: SimpleLocker) {
    this.firebaseRef.child(locker[ '$key' ])
      .set(locker,
           err => {
             if (err) {
               this.notificationService.failed('La sauvegarde a échoué ! ', err);
             }
           });
  }

  public deleteLockers() {
    this.firebaseRef.remove(
      error => this.notificationService.failed('La suppression des bouteilles a échoué', error)
    )
  }

  public initializeDB(lockers: SimpleLocker[]) {
    lockers.forEach(locker => this.firebaseRef.push(locker));
  }

  get allLockersObservable(): Observable<SimpleLocker[]> {
    return this._allLockersObservable;
  }

  private setallLockersArray(lockers: SimpleLocker[]) {
    this.allLockersArray = lockers;
    this._lockers.next(lockers);
  }

  /**
   * searches through the given lockers all that match all of the filters passed in
   * @param fromList array of lockers
   * @param keywords an array of searched keywords
   * @returns array of matching lockers
   */
  private getLockersByKeywords(fromList: SimpleLocker[], keywords: string[]): any {
    if (!keywords || keywords.length == 0) {
      return fromList;
    }
    let filtered = fromList;
    keywords.forEach(keyword => {
      filtered = this.filterOnKeyword(filtered, keyword);
    });

    return filtered;
  }

  /**
   * get the lockers which match one keyword
   * @param list
   * @param keyword
   * @returns {any[]}
   */
  private filterOnKeyword(list: any[], keyword: string) {
    let keywordLower = keyword.toLocaleLowerCase();
    return list.filter(locker => {
                         let matching = false;
                         for (let key in locker) {
                           if (locker[ key ].toString().toLocaleLowerCase().indexOf(keywordLower) !== -1) {
                             matching = true;
                           }
                         }
                         return matching;
                       }
    );
  }

  private filterByAttribute(fromList: SimpleLocker[ ], attribute: string, admissibleValues: string[ ]) {
    return fromList.filter(locker => {
      let ret = true;
      let attrValue = locker[ attribute ].toString();
      //admissibleValues.forEach(admissibleValue => ret = ret && attrValue.indexOf(admissibleValue) !== -1);
      return admissibleValues.indexOf(attrValue) !== -1;
    })
  }
}


