import {Component} from '@angular/core';
import {UploadBottlesPage} from '../../_features/admin/upload-bottles/upload-bottles.page';
import {DashboardPage} from '../../_features/browse/dashboard/dashboard';
import {ProfilePage} from '../../_features/admin/profile/profile';
import {CellarPage} from '../../_features/racks/cellar/cellar.page';
import {NavController, Platform} from 'ionic-angular';
import {NotificationService} from '../../service/notification.service';

@Component({
             templateUrl: 'tabs.html'
           })
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  userRoot: any = ProfilePage;
  //browseRoot: any = BrowsePage;
  cellarRoot: any = CellarPage;
  dashboardRoot: any = DashboardPage;
  adminRoot: any = UploadBottlesPage;

  //adminRoot: any = TestPage;

  constructor(platform: Platform, private navCtrl: NavController, private notificationService: NotificationService) {
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
