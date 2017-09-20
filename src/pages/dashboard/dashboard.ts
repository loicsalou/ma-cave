import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavController} from 'ionic-angular';
import {BrowsePage} from '../browse/browse.page';
import {LoginService} from '../../service/login.service';
import {BottlePersistenceService} from '../../service/bottle-persistence.service';
import {Bottle} from '../../model/bottle';
import {FilterSet} from '../../components/distribution/distribution';
import {Subscription} from 'rxjs/Subscription';
import {NativeProvider} from '../../providers/native/native';
import {NotificationService} from '../../service/notification.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
             selector: 'page-dashboard',
             templateUrl: 'dashboard.html',
             styleUrls: [ '/dashboard.scss' ]
           })
export class DashboardPage implements OnInit, OnDestroy {
  version: any;
  bottles: Bottle[];
  totalNumberOfBottles: number = 0;
  private bottleSub: Subscription;

  constructor(public navCtrl: NavController, public loginService: LoginService, private notificationService: NotificationService,
              private bottleService: BottlePersistenceService, private nativeProvider: NativeProvider,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.nativeProvider.feedBack();

    this.version = require('../../../package.json').version;
    this.bottleSub = this.bottleService.allBottlesObservable.subscribe(
      (bottles: Bottle[]) => {
        if (bottles && bottles.length > 0) {
          this.bottles = bottles;
          this.totalNumberOfBottles = bottles.reduce((tot: number, btl: Bottle) => tot + +btl.quantite_courante, 0);
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.bottleSub.unsubscribe();
  }

  filterOnText(event: any) {
    let text = event.target.value;
    if (text != undefined && text.length != 0) {
      this.notificationService.debugAlert('recherche de: ' + text);
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
    this.loginService.logout();
    this.navCtrl.popToRoot();
  }

  showFavorites() {
    let fs: FilterSet = new FilterSet(this.translateService);
    fs.favoriteOnly = true;
    this.navCtrl.push(BrowsePage, {filterSet: fs});
  }
}
