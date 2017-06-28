import {Component} from '@angular/core';
import {UploadBottlesPage} from '../upload-bottles/upload-bottles.page';
import {DashboardPage} from '../dashboard/dashboard';
import {HomePage} from '../home/home';

@Component({
             templateUrl: 'tabs.html'
           })
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  loginRoot: any = HomePage;
  dashboardRoot: any = DashboardPage;
  adminRoot: any = UploadBottlesPage;

  constructor() {
  }
}
