import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Loading, ModalController, NavController, Platform, PopoverController, VirtualScroll} from 'ionic-angular';
import {BrowsePage} from '../browse/browse.page';
import {LoginService} from '../../../service/login/login.service';
import {BottlePersistenceService} from '../../../service/bottle-persistence.service';
import {Bottle} from '../../../model/bottle';
import {FilterSet} from '../../../components/distribution/filterset';
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
import {VERSION} from '../../admin/version';
import {ApplicationState} from '../../../app/state/app.state';
import {Store} from '@ngrx/store';
import {BottlesQuery} from '../../../app/state/bottles.state';
import {ResetFilterAction, UpdateFilterAction} from '../../../app/state/filters.action';

@Component({
             selector: 'page-dashboard',
             templateUrl: 'dashboard.html'
             // styleUrls:[ 'dashboard.scss' ]
           })
export class DashboardPage implements OnInit, OnDestroy {
  bottles: Bottle[];
  totalNumberOfBottles: number = 0;
  version: any;
  withdrawals: Withdrawal[] = [];

  @ViewChild('withdrawals') listComponent: BottleItemComponent;
  @ViewChild(VirtualScroll) vs: VirtualScroll;

  private _withdrawalCardStyle: { 'min-height': string; 'height': string };
  private bottleSub: Subscription;
  private mostUsedQueries: SearchCriteria[];
  private popup: Loading;
  private queriesSub: Subscription;
  private withdrawalsSub: Subscription;

  constructor(public navCtrl: NavController, public loginService: LoginService, private notificationService: NotificationService,
              private bottleService: BottlePersistenceService, private nativeProvider: NativeProvider,
              private platform: Platform, private translateService: TranslateService,
              private popoverCtrl: PopoverController, private modalCtrl: ModalController,
              private store: Store<ApplicationState>) {
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

  get withdrawalCardStyle() {
    return this._withdrawalCardStyle;
  }

  ngOnInit(): void {
    this.nativeProvider.feedBack();
    this.popup = this.notificationService.createLoadingPopup('app.loading');
    //this.version = require('../../../../package.json').version;
    this.version = VERSION;
    //this.bottleSub = this.bottleService.allBottlesObservable.subscribe(
    this.bottleSub = this.store.select(BottlesQuery.getBottles).subscribe(
      (bottles: Bottle[]) => {
        setTimeout(() => {
          this.popup.dismiss(), 10;
        });
        if (bottles && bottles.length > 0) {
          this.bottles = bottles;
          this.totalNumberOfBottles = bottles.reduce((tot: number, btl: Bottle) => tot + +btl.quantite_courante, 0);
        }
      },
      () => {
        this.popup.dismiss();
      },
      () => {
        this.popup.dismiss();
      }
    );

    this.withdrawalsSub = this.bottleService.fetchAllWithdrawals().subscribe(
      (withdrawals: Withdrawal[]) => {
        this.withdrawals = withdrawals;
        let height = 30 + Math.min(3, withdrawals.length) * 92;
        this._withdrawalCardStyle = {'min-height': '120px', 'height': height + 'px'};
      },
      (err) => {
        this.notificationService.error('messages.withdrawals-load-error');
        console.error('DashboardPage.ngOnInit: ' + err);
      }
    );

    let obs = this.bottleService.getMostUsedQueries();
    this.queriesSub = obs.subscribe(
      (queries: SearchCriteria[]) => this.mostUsedQueries = queries
    );
  }

  ngOnDestroy(): void {
    this.bottleSub.unsubscribe();
    this.withdrawalsSub.unsubscribe();
    this.queriesSub.unsubscribe();
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
    let fs: FilterSet = new FilterSet();
    fs.overdueOnly = true;
    this.store.dispatch(new UpdateFilterAction(fs))
    this.navCtrl.push(BrowsePage);
  }

  showFiltered(chosenFilter: FilterSet) {
    this.store.dispatch(new UpdateFilterAction(chosenFilter))
    this.navCtrl.push(BrowsePage);
  }

  showAll() {
    this.store.dispatch(new ResetFilterAction());
    this.navCtrl.push(BrowsePage);
  }

  logout() {
    this.loginService.logout();
    this.navCtrl.popToRoot();
  }

  showFavorites() {
    let fs: FilterSet = new FilterSet();
    fs.favoriteOnly = true;
    this.store.dispatch(new UpdateFilterAction(fs));
    this.navCtrl.push(BrowsePage);
  }

  private filterOnTextAndNavigate(texts: string[]) {
    let fs: FilterSet = new FilterSet();
    if (texts != undefined && texts.length != 0) {
      this.notificationService.debugAlert('recherche de: ' + texts);
      fs.text = texts;
      this.store.dispatch(new UpdateFilterAction(fs));
      this.navCtrl.push(BrowsePage);
    }
  }
}
