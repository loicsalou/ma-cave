/**
 * Created by loicsalou on 28.02.17.
 */
import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {Bottle, Position} from '../model/bottle';
import {Observable} from 'rxjs';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {FilterSet} from '../components/distribution/filterset';
import * as _ from 'lodash';
import {LoginService} from './login/login.service';
import {AbstractPersistenceService} from './abstract-persistence.service';
import {NotificationService} from './notification.service';
import {FirebaseAdminService} from './firebase/firebase-admin.service';
import {User} from '../model/user';
import {Subscription} from 'rxjs/Subscription';
import {Locker} from '../model/locker';
import {TranslateService} from '@ngx-translate/core';
import {BottleFactory} from '../model/bottle.factory';
import {Subject} from 'rxjs/Subject';
import {BottleNoting} from '../components/bottle-noting/bottle-noting.component';
import {Withdrawal} from '../model/withdrawal';
import {FirebaseWithdrawalsService} from './firebase/firebase-withdrawals.service';
import {FirebaseBottlesService} from './firebase/firebase-bottles.service';
import {FirebaseLockersService} from './firebase/firebase-lockers.service';
import {FirebaseImagesService} from './firebase/firebase-images.service';
import {SearchCriteria} from '../model/search-criteria';
import {ApplicationState} from '../app/state/app.state';
import {Store} from '@ngrx/store';
import {LoadBottlesSuccessAction} from '../app/state/bottles.actions';
import {tap} from 'rxjs/operators';
import {UserPreferences} from '../model/user-preferences';

/**
 * Services related to the bottles in the cellar.
 * The subregion_label below are duplicated in the code of france.component.html as they are emitted when end-user
 * clicks on a region to filter bottles. Any change on either side must be propagated on the other side.
 */
@Injectable()
export class SharedPersistenceService extends AbstractPersistenceService {
  private _bottles: BehaviorSubject<Bottle[]> = new BehaviorSubject<Bottle[]>([]);
  private _allBottlesObservable: Observable<Bottle[]> = this._bottles.asObservable();
  private _filteredBottles: BehaviorSubject<Bottle[]> = new BehaviorSubject<Bottle[]>([]);
  private _filteredBottlesObservable: Observable<Bottle[]> = this._filteredBottles.asObservable();
  private filters: FilterSet = new FilterSet();
  private allBottlesArray: Bottle[];
  private bottlesSub: Subscription;
  private _filtersObservable: BehaviorSubject<FilterSet>;

  constructor(private dataConnection: FirebaseAdminService,
              notificationService: NotificationService,
              loginService: LoginService,
              translateService: TranslateService) {
    super(notificationService, loginService, translateService);
    if (loginService.user) {
      this.initialize(loginService.user);
    }
  }

  getMostUsedQueries(nb: number = 5): Observable<SearchCriteria[]> {
    return this.dataConnection.getMostUsedQueries(nb);
  }

  getUserPreferences(): Observable<UserPreferences> {
    return this.dataConnection.getPreferences();
  }
}


