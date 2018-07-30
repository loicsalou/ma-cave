import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ModalController, NavController, Platform, PopoverController, VirtualScroll} from '@ionic/angular';
import {BrowsePage} from './browse/browse-page';
import {Bottle} from '../../model/bottle';
import {FilterSet} from '../../components/distribution/filterset';
import {NotificationService} from '../../service/notification.service';
import {PopoverPage} from './popover/popover-page';
import {Action} from '../../model/action';
import {BottleItemComponent} from '../../components/list-bottle-item/bottle-item.component';
import {Withdrawal} from '../../model/withdrawal';
import {RecordOutputPage} from './record-output/record-output';
import {SearchCriteria} from '../../model/search-criteria';
import {VERSION} from '../../app/version';
import {ApplicationState} from '../../app/state/app.state';
import {Store} from '@ngrx/store';
import {BottlesQuery} from '../../app/state/bottles.state';
import {
  LoadCellarAction,
  RemoveFilterAction,
  ResetFilterAction,
  UpdateFilterAction
} from '../../app/state/bottles.actions';
import {Observable, of} from 'rxjs';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {WithdrawalsQuery} from '../../app/state/withdrawals.state';
import {LoadWithdrawalsAction} from '../../app/state/withdrawals.actions';
import {SharedQuery, SharedState} from '../../app/state/shared.state';
import {LoadSharedAction, LogoutAction} from '../../app/state/shared.actions';
import {logInfo} from '../../utils/index';
import {Modal} from '@ionic-angular';

@Component({
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
              private platform: Platform,
              private popoverCtrl: PopoverController, private modalCtrl: ModalController,
              private store: Store<ApplicationState>) {
  }

  get withdrawalCardStyle() {
    return this._withdrawalCardStyle;
  }

  ngOnInit(): void {
    this.version = VERSION;
    this.bottles$ = this.store.select(BottlesQuery.getBottles).pipe(
      tap((bottles: Bottle[]) => {
            if (bottles && bottles.length > 0) {
              this.totalNumberOfBottles = bottles.reduce((tot: number, btl: Bottle) => tot + +btl.quantite_courante, 0);
            }
          }
      ),
      tap(bottles => {
        logInfo('[dashboard.ts] received bottles: ' + bottles.length);
      }),
      catchError(err => {
        this.notificationService.error('Erreur lors de la récupération de la liste de bouteilles: ' + err);
        this.totalNumberOfBottles = 0;
        return of([]);
      })
    );

    this.withdrawals$ = this.store.select(WithdrawalsQuery.getWithdrawals).pipe(
      map((withdrawals: Withdrawal[]) => withdrawals.sort(
        (a: Withdrawal, b: Withdrawal) => {
          return a.withdrawal_date > b.withdrawal_date ? -1 : 1;
        })
      ),
      tap((withdrawals: Withdrawal[]) => {
        let height = 30 + Math.min(3, withdrawals.length) * 92;
        this._withdrawalCardStyle = {'min-height': '120px', 'height': height + 'px'};
      }),
      tap(withdrawals => logInfo('[dashboard.ts] received withdrawals: ' + withdrawals.length)),
      catchError((err) => {
        this.notificationService.error('messages.withdrawals-load-error');
        return of([]);
      })
    );
    this.store.dispatch(new LoadWithdrawalsAction());

    this.mostUsedQueries$ = this.store.select(SharedQuery.getSharedState).pipe(
      map((state: SharedState) => state.mostUsedQueries),
      tap(queries => logInfo('[dashboard.ts] received most used queries: ' + queries.length)),
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
    this.store.dispatch(new LoadCellarAction());
  }

  ngOnDestroy() {
  }

  async triggerNotation(bottle) {
    const modal = await this.modalCtrl.create({
                                                component: RecordOutputPage
                                              });
    return await modal.present();
  }

  async showPopover(myEvent) {
    const popover = this.popoverCtrl.create({
                                              component: PopoverPage,
                                              ev: {
                                                queries: this.mostUsedQueries$,
                                                cssClass: 'shadowed-grey'
                                              }
                                            });
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
    this.navCtrl.push('BrowsePage');
  }

  showFiltered(chosenFilter: FilterSet) {
    this.store.dispatch(new UpdateFilterAction(chosenFilter));
    this.navCtrl.push('BrowsePage');
  }

  showAll() {
    this.store.dispatch(new ResetFilterAction());
    this.navCtrl.push('BrowsePage');
  }

  logout() {
    this.store.dispatch(new LogoutAction());
    //this.navCtrl.setRoot(HomePage);
    //this.navCtrl.popToRoot();
    //setTimeout(() => {
    //             window.history.pushState({}, '', '/');
    //             //window.location.reload();
    //           }
    //  , 100);
  }

  showFavorites() {
    let fs: FilterSet = new FilterSet();
    fs.favoriteOnly = true;
    this.store.dispatch(new UpdateFilterAction(fs));
    this.navCtrl.push('BrowsePage');
  }

  private filterOnTextAndNavigate(texts: string[]) {
    let fs: FilterSet = new FilterSet();
    if (texts != undefined && texts.length != 0) {
      fs.text = texts;
      this.store.dispatch(new UpdateFilterAction(fs));
      this.navCtrl.push('BrowsePage');
    }
  }
}
