import {Component} from "@angular/core";
import {HomePage} from "../home/home";
import {AboutPage} from "../about/about";
//import {ContactPage} from "../contact/contact";
import {BrowsePage} from "../browse/browse.page";
import {Browse2Page} from "../browse2/browse2.page";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;
  tab2Root: any = AboutPage;
//  tab3Root: any = ContactPage;
  tab3Root: any = Browse2Page;
  tab4Root: any = BrowsePage;

  constructor() {

  }
}
