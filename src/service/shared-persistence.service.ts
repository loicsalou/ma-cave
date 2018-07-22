/**
 * Created by loicsalou on 28.02.17.
 */
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AbstractPersistenceService} from './abstract-persistence.service';
import {NotificationService} from './notification.service';
import {FirebaseAdminService} from './firebase/firebase-admin.service';
import {TranslateService} from '@ngx-translate/core';
import {SearchCriteria} from '../model/search-criteria';
import {UserPreferences} from '../model/user-preferences';
import {FilterSet} from '../components/distribution/filterset';
import {map} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../app/state/app.state';
import {BOTTLE_ITEM_TYPE} from '../app/state/shared.state';

/**
 * Services related to the bottles in the cellar.
 * The subregion_label below are duplicated in the code of france.component.html as they are emitted when end-user
 * clicks on a region to filter bottles. Any change on either side must be propagated on the other side.
 */
@Injectable()
export class SharedPersistenceService extends AbstractPersistenceService {

  constructor(private dataConnection: FirebaseAdminService,
              notificationService: NotificationService,
              translateService: TranslateService,
              store: Store<ApplicationState>) {
    super(notificationService, translateService, store);
    this.subscribeLogin();
  }

  getMostUsedQueries(nb: number = 5): Observable<SearchCriteria[]> {
    return this.dataConnection.getSharedState().pipe(
      map((prefs: UserPreferences) => prefs.mostUsedQueries)
    );
  }

  getUserPreferences(): Observable<UserPreferences> {
    return this.dataConnection.getSharedState();
  }

  /**
   * Enregistre
   * @param fromList array of bottles
   * @param keywords an array of searched keywords
   * @returns array of matching bottles
   */
  updateQueryStats(keywords: string[]) {
    if (!keywords || keywords.length == 0) {
      return;
    }
    keywords = keywords.map(
      kw => {
        return kw.trim().toLowerCase();
      }
    );
    keywords = keywords.sort();
    this.dataConnection.updateQueryStats(keywords);
  }

  updatePrefs(theme: string, itemType: BOTTLE_ITEM_TYPE) {
    this.dataConnection.updatePrefs(theme, itemType);
  }

  /**
   * Analyse le filtre pour éventuellement stocker les plus fréquents
   * @param {FilterSet} filterset
   */
  updateFilterStats(filterset: FilterSet) {
    if (filterset.text && filterset.text.length > 0) {
      this.updateQueryStats(filterset.text);
    }
  }
}


