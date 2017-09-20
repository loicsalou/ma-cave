import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavController, PopoverController} from 'ionic-angular';
import {BrowsePage} from '../browse/browse.page';
import {LoginService} from '../../service/login.service';
import {BottlePersistenceService} from '../../service/bottle-persistence.service';
import {Bottle} from '../../model/bottle';
import {FilterSet} from '../../components/distribution/distribution';
import {Subscription} from 'rxjs/Subscription';
import {NativeProvider} from '../../providers/native/native';
import {NotificationService} from '../../service/notification.service';
import {TranslateService} from '@ngx-translate/core';
import {SearchCriteria} from '../../service/firebase-connection.service';
import {PopoverPage} from './popover.page';

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
  private queriesSub: Subscription;
  private mostUsedQueries: SearchCriteria[];

  constructor(public navCtrl: NavController, public loginService: LoginService, private notificationService: NotificationService,
              private bottleService: BottlePersistenceService, private nativeProvider: NativeProvider,
              private translateService: TranslateService, private popoverCtrl: PopoverController) {
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

    let obs = this.bottleService.getMostUsedQueries();
    this.queriesSub = obs.subscribe(
      (queries: SearchCriteria[]) => this.mostUsedQueries = queries
    )
  }

  ngOnDestroy(): void {
    this.bottleSub.unsubscribe();
  }

  showPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverPage, this.mostUsedQueries);
    popover.onDidDismiss((keywords: string[]) => {
      if (keywords) {
        this.filterOnTextAndNavigate(keywords);
      }
    })
    popover.present({
                      ev: myEvent
                    });
  }

  filterOnText(event: any) {
    let text = event.target.value;
    this.filterOnTextAndNavigate(text.split(' '));
  }

  private filterOnTextAndNavigate(texts: string[]) {
    let fs: FilterSet = new FilterSet(this.translateService);
    if (texts != undefined && texts.length != 0) {
      this.notificationService.debugAlert('recherche de: ' + texts);
      fs.text = texts;
      this.navCtrl.push(BrowsePage, {
        filterSet: fs
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
