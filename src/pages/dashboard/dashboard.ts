import {Component, OnInit} from '@angular/core';
import {NavController} from 'ionic-angular';
import {BrowsePage} from '../browse/browse.page';
import {LoginService} from '../../service/login.service';
import {BottleService} from '../../service/firebase-bottle.service';
import {Bottle} from '../../model/bottle';

@Component({
             selector: 'page-dashboard',
             templateUrl: 'dashboard.html',
             styleUrls: [ '/dashboard.scss' ]
           })
export class DashboardPage implements OnInit {
  version: any;
  bottles: Bottle[];

  constructor(public navCtrl: NavController, public loginService: LoginService, private bottleService: BottleService) {
  }

  ngOnInit(): void {
    this.version = require('../../../package.json').version;
    this.bottleService.allBottlesObservable.subscribe((bottles: Bottle[]) => this.bottles = bottles);
  }

  filterOnText(event: any) {
    let text = event.target.value;
    if (text != undefined && text.length != 0) {
      this.navCtrl.push(BrowsePage, {
        text: text
      })
    }
  }

  browseCellar() {
    this.navCtrl.push(BrowsePage);
  }

  logout() {
    this.loginService.logout();
    this.navCtrl.popToRoot();
  }
}
