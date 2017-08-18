import {Component} from '@angular/core';
import {UploadBottlesPage} from '../upload-bottles/upload-bottles.page';
import {DashboardPage} from '../dashboard/dashboard';
import {HomePage} from '../home/home';
import {ProfilePage} from '../profile/profile';
import {BrowsePage} from '../browse/browse.page';
import {CellarPage} from '../cellar/cellar.page';
import {NavController, Platform} from 'ionic-angular';

@Component({
             templateUrl: 'tabs.html'
           })
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  loginRoot: any = HomePage;
  userRoot: any = ProfilePage;
  browseRoot: any = BrowsePage;
  cellarRoot: any = CellarPage;
  dashboardRoot: any = DashboardPage;
  adminRoot: any = UploadBottlesPage;

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
