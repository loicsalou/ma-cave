import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ModalController, NavController, Platform, PopoverController, VirtualScroll} from 'ionic-angular';
import {BrowsePage} from '../browse/browse.page';
import {Bottle} from '../../../model/bottle';
import {FilterSet} from '../../../components/distribution/filterset';
import {NativeProvider} from '../../../providers/native/native';
import {NotificationService} from '../../../service/notification.service';
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
import {RemoveFilterAction, ResetFilterAction, UpdateFilterAction} from '../../../app/state/bottles.actions';
import {Observable} from 'rxjs/Observable';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {of} from 'rxjs/observable/of';
import {WithdrawalsQuery} from '../../../app/state/withdrawals.state';
import {LoadWithdrawalsAction} from '../../../app/state/withdrawals.actions';
import {SharedQuery, SharedState} from '../../../app/state/shared.state';
import {LoadSharedAction, LogoutAction} from '../../../app/state/shared.actions';

@Component({
             selector: 'page-dashboard',
             templateUrl: 'dashboard.html',
             changeDetection: ChangeDetectionStrategy.OnPush
             // styleUrls:[ 'dashboard.scss' ]
           })
export class DashboardPage implements OnInit, OnDestroy {
  bottles$: Observable<Bottle[]>;
  withdrawals$: Observable<Withdrawal[]>;
  mostUsedQueries$: Observable<SearchCriteria[]>;
  popOverVisible$: Observable<boolean>;

  totalNumberOfBottles: number = 0;
  version: any;

  @ViewChild('withdrawals') listComponent: BottleItemComponent;
  @ViewChild(VirtualScroll) vs: VirtualScroll;

  private _withdrawalCardStyle: { 'min-height': string; 'height': string };

  constructor(public navCtrl: NavController, private notificationService: NotificationService,
              private nativeProvider: NativeProvider,
              private platform: Platform,
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
    this.version = VERSION;
    this.bottles$ = this.store.select(BottlesQuery.getBottles).pipe(
      tap((bottles: Bottle[]) => {
            if (bottles && bottles.length > 0) {
              this.totalNumberOfBottles = bottles.reduce((tot: number, btl: Bottle) => tot + +btl.quantite_courante, 0);
            }
          }
      ),
      catchError(err => {
        this.notificationService.error('Erreur lors de la récupération de la liste de bouteilles: ' + err);
        this.totalNumberOfBottles = 0;
        return of([]);
      })
    );

    this.withdrawals$ = this.store.select(WithdrawalsQuery.getWithdrawals).pipe(
      tap((withdrawals: Withdrawal[]) => {
        let height = 30 + Math.min(3, withdrawals.length) * 92;
        this._withdrawalCardStyle = {'min-height': '120px', 'height': height + 'px'};
      }),
      catchError((err) => {
        this.notificationService.error('messages.withdrawals-load-error');
        return of([]);
      })
    );
    this.store.dispatch(new LoadWithdrawalsAction());

    this.mostUsedQueries$ = this.store.select(SharedQuery.getSharedState).pipe(
      map((state: SharedState) => state.mostUsedQueries),
      catchError((err) => {
                   this.notificationService.error('messages.most-used-queries-failed');
                   return of([]);
                 }
      )
    );
    this.popOverVisible$ = this.mostUsedQueries$.pipe(
      switchMap(
        (queries: SearchCriteria[]) => of(queries && queries.length > 0)
      )
    );
    this.store.dispatch(new LoadSharedAction());
  }

  ngOnDestroy() {
  }

  triggerNotation(bottle) {
    let modal = this.modalCtrl.create(RecordOutputPage, {bottle: bottle});
    modal.present();
  }

  showPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverPage, this.mostUsedQueries$, {cssClass: 'shadowed-grey'});
    popover.onDidDismiss((action: Action) => {
      if (action != null) {
        let keywords = action.param;
        if (action.name === 'remove') {
          this.store.dispatch(new RemoveFilterAction(keywords));
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
    this.store.dispatch(new UpdateFilterAction(fs));
    this.navCtrl.push(BrowsePage);
  }

  showFiltered(chosenFilter: FilterSet) {
    this.store.dispatch(new UpdateFilterAction(chosenFilter));
    this.navCtrl.push(BrowsePage);
  }

  showAll() {
    this.store.dispatch(new ResetFilterAction());
    this.navCtrl.push(BrowsePage);
  }

  logout() {
    this.store.dispatch(new LogoutAction());
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
      fs.text = texts;
      this.store.dispatch(new UpdateFilterAction(fs));
      this.navCtrl.push(BrowsePage);
    }
  }
}
