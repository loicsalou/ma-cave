import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Loading, ModalController, NavController, Platform, PopoverController, VirtualScroll} from 'ionic-angular';
import {BrowsePage} from '../browse/browse.page';
import {LoginService} from '../../../service/login/login.service';
import {BottlePersistenceService} from '../../../service/bottle-persistence.service';
import {Bottle} from '../../../model/bottle';
import {FilterSet} from '../../../components/distribution/distribution';
import {Subscription} from 'rxjs/Subscription';
import {NativeProvider} from '../../../providers/native/native';
import {NotificationService} from '../../../service/notification.service';
import {TranslateService} from '@ngx-translate/core';
import {PopoverPage} from '../popover/popover.page';
import {Action} from '../../../model/action';
import {BottleItemComponent} from '../../../components/list/bottle-item.component';
import {Withdrawal} from '../../../model/withdrawal';
import {RecordOutputPage} from '../record-output/record-output';
import {SearchCriteria} from '../../../model/search-criteria';

@Component({
             selector: 'page-dashboard',
             templateUrl: 'dashboard.html',
             // styleUrls:[ 'dashboard.scss' ]
           })
export class DashboardPage implements OnInit, OnDestroy {
  version: any;
  bottles: Bottle[];
  totalNumberOfBottles: number = 0;
  withdrawals: Withdrawal[] = [];
  @ViewChild('withdrawals')
  listComponent: BottleItemComponent;
  @ViewChild(VirtualScroll) vs: VirtualScroll;
  private bottleSub: Subscription;
  private queriesSub: Subscription;
  private mostUsedQueries: SearchCriteria[];
  private popup: Loading;
  private allWithdrawals: Withdrawal[];
  private withdrawalsSub: Subscription;
  private withdrawalCardStyle: { 'min-height': string; 'height': string };

  constructor(public navCtrl: NavController, public loginService: LoginService, private notificationService: NotificationService,
              private bottleService: BottlePersistenceService, private nativeProvider: NativeProvider,
              private platform: Platform, private translateService: TranslateService,
              private popoverCtrl: PopoverController, private modalCtrl: ModalController) {
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

  ngOnInit(): void {
    this.nativeProvider.feedBack();
    this.popup = this.notificationService.createLoadingPopup('app.loading');
    this.version = require('../../../../package.json').version;
    this.bottleSub = this.bottleService.allBottlesObservable.subscribe(
      (bottles: Bottle[]) => {
        if (bottles && bottles.length > 0) {
          this.bottles = bottles;
          this.totalNumberOfBottles = bottles.reduce((tot: number, btl: Bottle) => tot + +btl.quantite_courante, 0);
          setTimeout(() => {
            this.popup.dismiss(), 300
          });
        }
      },
      () => {
        this.popup.dismiss()
      },
      () => {
        this.popup.dismiss()
      }
    );

    this.withdrawalsSub = this.bottleService.fetchAllWithdrawals().subscribe(
      (withdrawals: Withdrawal[]) => {
        this.withdrawals = withdrawals;
        let height = 30 + Math.min(3, withdrawals.length) * 92;
        this.withdrawalCardStyle = {'min-height': '120px', 'height': height + 'px'};
        //this.allWithdrawals = withdrawals;
        //this.doInfinite(null);
      },
      (err) => {
        this.notificationService.error('messages.withdrawals-load-error');
        console.error('DashboardPage.ngOnInit: ' + err);
      }
    );

    let obs = this.bottleService.getMostUsedQueries();
    this.queriesSub = obs.subscribe(
      (queries: SearchCriteria[]) => this.mostUsedQueries = queries
    )
  }

  //
  //doInfinite(infiniteScroll: InfiniteScroll) {
  //  setTimeout(() => {
  //    if (this.withdrawals.length < this.allWithdrawals.length) {
  //      let size = this.withdrawals.length;
  //      let added = this.allWithdrawals.slice(size, size + 4);
  //      this.withdrawals = this.withdrawals.concat(added);
  //      this.doInfinite(infiniteScroll);
  //    } else {
  //      if (infiniteScroll) {
  //        infiniteScroll.complete();
  //      }
  //    }
  //
  //  }, 10);
  //}

  ngOnDestroy(): void {
    this.bottleSub.unsubscribe();
  }

  triggerNotation(bottle) {
    let modal = this.modalCtrl.create(RecordOutputPage, {bottle: bottle});
    modal.present();

  }

  showPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverPage, this.mostUsedQueries, {cssClass: 'shadowed-grey'});
    popover.onDidDismiss((action: Action) => {
      if (action != null) {
        let keywords = action.param;
        if (action.name === 'remove') {
          this.bottleService.removeFromQueryStats(keywords);
        } else {
          if (keywords) {
            this.filterOnTextAndNavigate(keywords);
          }
        }
      }
    });
    popover.present({
                      ev: myEvent
                    });
  }

  filterOnText(event: any) {
    let text = event.target.value;
    this.filterOnTextAndNavigate(text.split(' '));
  }

  showOverdue() {
    let fs: FilterSet = new FilterSet(this.translateService);
    fs.overdueOnly = true;
    this.navCtrl.push(BrowsePage, {filterSet: fs});
  }

  showFiltered(chosenFilter: FilterSet) {
    this.navCtrl.push(BrowsePage, {filterSet: chosenFilter});
  }

  showAll() {
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
}
