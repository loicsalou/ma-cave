import {ChangeDetectionStrategy, Component} from '@angular/core';
import {UploadBottlesPage} from '../../_features/admin/upload-bottles/upload-bottles.page';
import {DashboardPage} from '../../_features/browse/dashboard/dashboard';
import {ProfilePage} from '../../_features/admin/profile/profile';
import {CellarPage} from '../../_features/racks/cellar/cellar.page';
import {NavController, Platform} from 'ionic-angular';
import {ApplicationState} from '../state/app.state';
import {Store} from '@ngrx/store';
import {SharedQuery, SharedState} from '../state/shared.state';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs/Observable';

@Component({
             templateUrl: 'tabs.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class TabsPage {
  userRoot: any = ProfilePage;
  cellarRoot: any = CellarPage;
  dashboardRoot: any = DashboardPage;
  adminRoot: any = UploadBottlesPage;
  selectedTheme$: Observable<string>;

  constructor(private platform: Platform, private navCtrl: NavController, private store: Store<ApplicationState>) {
    platform.ready().then(() => {
      platform.registerBackButtonAction(() => {
        if (navCtrl.canGoBack()) {
          navCtrl.pop();
        } else {
          //don't do anything
        }
      });
      this.retrieveTheme();
    });
  }

  private retrieveTheme() {
    this.selectedTheme$ = this.store.select(SharedQuery.getSharedState).pipe(
      map((state: SharedState) => state.theme ? state.theme : 'cavus-theme')
    );
  }
}
