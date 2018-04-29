import {Component} from '@angular/core';
import {UploadBottlesPage} from '../../_features/admin/upload-bottles/upload-bottles.page';
import {DashboardPage} from '../../_features/browse/dashboard/dashboard';
import {ProfilePage} from '../../_features/admin/profile/profile';
import {CellarPage} from '../../_features/racks/cellar/cellar.page';
import {NavController, Platform} from 'ionic-angular';

@Component({
             templateUrl: 'tabs.html'
           })
export class TabsPage {
  userRoot: any = ProfilePage;
  cellarRoot: any = CellarPage;
  dashboardRoot: any = DashboardPage;
  adminRoot: any = UploadBottlesPage;
  selectedTheme = 'cavus-theme';

  constructor(platform: Platform, navCtrl: NavController) {
    platform.ready().then(() => {
      platform.registerBackButtonAction(() => {
        if (navCtrl.canGoBack()) {
          navCtrl.pop();
        } else {
          //don't do anything
        }
      });
    });
  }

}
