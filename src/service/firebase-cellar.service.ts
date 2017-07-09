/**
 * Created by loicsalou on 28.02.17.
 */
import {Injectable} from '@angular/core';
import {Locker} from '../model/locker';
import {Observable} from 'rxjs';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {AngularFireDatabase} from 'angularfire2/database';
import {LockerFactory} from '../model/locker.factory';
import {LoadingController} from 'ionic-angular';
import * as firebase from 'firebase/app';
import {LoginService} from './login.service';
import {FirebaseService} from './firebase-service';
import {NotificationService} from './notification.service';
import {TranslateService} from '@ngx-translate/core';
import Reference = firebase.database.Reference;
import {CellarService} from './cellar.service';

/**
 * Services related to the cellar itself, locker and place of the lockers.
 * The subregion_label below are duplicated in the code of france.component.html as they are emitted when end-user
 * clicks on a region to filter lockers. Any change on either side must be propagated on the other side.
 */
@Injectable()
export class FirebaseCellarService extends FirebaseService implements CellarService {
  private CELLAR_FOLDER = 'cellar';
  private CELLAR_ROOT: string;

  private firebaseRef: Reference;
  private _lockers: BehaviorSubject<Locker[]> = new BehaviorSubject<Locker[]>([]);
  private _allLockersObservable: Observable<Locker[]> = this._lockers.asObservable();
  private allLockersArray: Locker[];

  constructor(firebase: AngularFireDatabase,
              loadingCtrl: LoadingController,
              private lockerFactory: LockerFactory,
              notificationService: NotificationService,
              loginService: LoginService,
              translateService: TranslateService) {
    super(firebase, loadingCtrl, notificationService, loginService, translateService);
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
    this.showLoading();
    try {
      let items = this.angularFirebase.list(this.CELLAR_ROOT, {
        query: {
          orderByChild: 'name',
        }
      });
      items.subscribe((lockers: Locker[]) => {
        lockers.forEach((locker: Locker) => this.lockerFactory.create(locker));
        this.setallLockersArray(lockers);
        this.dismissLoading();
      });
    } catch (error) {
      this.dismissLoading();
      this.handleError('Impossible de charger les casiers', error)
    }
  }

  public update(lockers: Locker[]) {
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

  public save(lockers: Locker[]) {
    lockers.forEach(locker => this.firebaseRef.push(locker));
  }

  public replaceLocker(locker: Locker) {
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

  public initializeDB(lockers: Locker[]) {
    lockers.forEach(locker => this.firebaseRef.push(locker));
  }

  get allLockersObservable(): Observable<Locker[]> {
    return this._allLockersObservable;
  }

  private setallLockersArray(lockers: Locker[]) {
    this.allLockersArray = lockers;
    this._lockers.next(lockers);
  }

  /**
   * searches through the given lockers all that match all of the filters passed in
   * @param fromList array of lockers
   * @param keywords an array of searched keywords
   * @returns array of matching lockers
   */
  private getLockersByKeywords(fromList: Locker[], keywords: string[]): any {
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

  private filterByAttribute(fromList: Locker[ ], attribute: string, admissibleValues: string[ ]) {
    return fromList.filter(locker => {
      let ret = true;
      let attrValue = locker[ attribute ].toString();
      //admissibleValues.forEach(admissibleValue => ret = ret && attrValue.indexOf(admissibleValue) !== -1);
      return admissibleValues.indexOf(attrValue) !== -1;
    })
  }
}


