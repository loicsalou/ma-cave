import {Component, OnInit} from '@angular/core';
import {NavController} from 'ionic-angular';
import {BrowsePage} from '../browse/browse.page';
import {LoginService} from '../../service/login.service';
import {BottlePersistenceService} from '../../service/bottle-persistence.service';
import {Bottle} from '../../model/bottle';
import {FilterSet} from '../../components/distribution/distribution';
import {Subscription} from 'rxjs/Subscription';

@Component({
             selector: 'page-dashboard',
             templateUrl: 'dashboard.html',
             styleUrls: [ '/dashboard.scss' ]
           })
export class DashboardPage implements OnInit {
  version: any;
  bottles: Bottle[];
  private bottleSub: Subscription;

  constructor(public navCtrl: NavController, public loginService: LoginService, private bottleService: BottlePersistenceService) {
  }

  ngOnInit(): void {
    this.version = require('../../../package.json').version;
    this.bottleSub = this.bottleService.allBottlesObservable.subscribe(
      (bottles: Bottle[]) => {
        if (bottles && bottles.length > 0) {
          this.bottles = bottles
        }
      }
    );
  }

  filterOnText(event: any) {
    let text = event.target.value;
    if (text != undefined && text.length != 0) {
      this.navCtrl.push(BrowsePage, {
        text: text
      })
    }
  }

  browse(chosenFilter: FilterSet) {
    this.navCtrl.push(BrowsePage, {filterSet: chosenFilter});
    //this.bottleService.filterOn(chosenFilter);
  }

  browseCellar() {
    this.navCtrl.push(BrowsePage);
  }

  logout() {
    this.bottleSub.unsubscribe();
    this.loginService.logout();
    this.navCtrl.popToRoot();
  }
}
