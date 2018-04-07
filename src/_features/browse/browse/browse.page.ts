import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {InfiniteScroll, MenuController, NavController, NavParams, Platform, VirtualScroll} from 'ionic-angular';
import {BottlePersistenceService} from '../../../service/bottle-persistence.service';
import {Bottle} from '../../../model/bottle';
import {BottleDetailPage} from '../bottle-detail/page-bottle-detail';
import {FilterSet} from '../../../components/distribution/distribution';
import {Subscription} from 'rxjs/Subscription';
import * as _ from 'lodash';
import {LoginService} from '../../../service/login/login.service';
import {NotificationService} from '../../../service/notification.service';
import {CellarPage} from '../../racks/cellar/cellar.page';
import {BottleItemComponent} from '../../../components/list/bottle-item.component';
import {TranslateService} from '@ngx-translate/core';
import {NativeProvider} from '../../../providers/native/native';
import {Observable} from 'rxjs/Observable';

@Component({
             selector: 'page-browse',
             templateUrl: 'browse.page.html',
             //changeDetection: ChangeDetectionStrategy.OnPush
             // styleUrls:[ 'browse.page.scss' ]
           })
export class BrowsePage implements OnInit, OnDestroy {
  allBottles: Bottle[];
  bottles: Bottle[];
  bottles$: Observable<Bottle[]>;
  nbSelected = 0;
  filterSet: FilterSet = new FilterSet(this.translateService);

  @ViewChild('bottleList') listComponent: BottleItemComponent;
  @ViewChild(VirtualScroll) vs: VirtualScroll;

  private bottleSubscription: Subscription;
  private filterSubscription: Subscription;
  private searchBarVisible: boolean = false;
  private navParams: NavParams;
  private nbOfBottles: number = 0;

  constructor(public navCtrl: NavController, public platform: Platform, private bottlesService: BottlePersistenceService,
              private notificationService: NotificationService, private menuController: MenuController,
              private translateService: TranslateService, private nativeProvider: NativeProvider, params?: NavParams) {
    this.notificationService.traceDebug('BrowsePage.constructor');
    this.navParams = params;
  }

  ngOnInit() {
    this.nativeProvider.feedBack();
    this.initFilterFromNavParams();
    this.bottlesService.filterOn(this.filterSet);
    this.filterSubscription = this.bottlesService.filtersObservable.subscribe(
      filterSet => {
        this.notificationService.debugAlert('filterSetReceived:' + filterSet.text);
        this.setFilterSet(filterSet);
      });

    this.bottles$ = this.bottlesService.filteredBottlesObservable;
    this.bottleSubscription = this.bottles$.subscribe(
      (received: Bottle[]) => {
        this.notificationService.debugAlert('received:' + (received ? received.length : 0) + ' bottles');
        this.allBottles = received;
        this.bottles = [];
        this.nbOfBottles = 0;
        if (received) {
          this.nbOfBottles = received.reduce(
            (tot: number, btl: Bottle) => tot + +btl.quantite_courante,
            0
          );
        }
        if (this.filterSet && this.filterSet.sortOption) {
          this.allBottles = _.orderBy(this.allBottles,
                                      [ this.filterSet.sortOption.sortOn, 'country_label', 'subregion_label', 'area_label', 'nomCru', 'millesime' ],
                                      [ this.filterSet.sortOption.sortOrder == undefined ? 'asc' : this.filterSet.sortOption.sortOrder,
                                        'asc', 'asc', 'asc', 'asc', 'asc' ]
          );
        } else {
          this.allBottles = _.orderBy(this.allBottles, [ 'quantite_courante', 'country_label', 'subregion_label',
            'area_label', 'nomCru', 'millesime' ], [ 'desc', 'asc', 'asc', 'asc', 'asc', 'asc' ]
          );
        }
        this.doInfinite(null);
      },
      error => this.notificationService.error('BrowsePage: Erreur lors de l\'accès à la base de données' + error),
      () => this.notificationService.traceInfo('BrowsePage: ngOnInit, récupération de ' + this.nbOfBottles + ' bouteilles terminée')
    );
  }

  ngOnDestroy(): void {
    this.bottleSubscription.unsubscribe();
    this.filterSubscription.unsubscribe();
  }

  doInfinite(infiniteScroll: InfiniteScroll) {
    setTimeout(() => {
      if (this.bottles.length < this.allBottles.length) {
        let size = this.bottles.length;
        let added = this.allBottles.slice(size, size + 50);
        this.bottles = this.bottles.concat(added);
        this.doInfinite(infiniteScroll);
      } else {
        if (infiniteScroll) {
          infiniteScroll.complete();
        }
      }

    }, 10);
  }

  anyBottleSelected(): boolean {
    return this.nbSelected > 0;
  }

  placeSelection() {
    let selectedBottles = this.bottles.filter(btl => btl.selected);
    this.navCtrl.push(CellarPage, {bottlesToPlace: selectedBottles});
    selectedBottles.forEach(btl => delete btl.selected);
    this.resetSelection();
  }

  locateSelection() {
    let selectedBottles = this.bottles.filter(btl => btl.selected);
    this.navCtrl.push(CellarPage, {bottlesToHighlight: selectedBottles});
    selectedBottles.forEach(btl => delete btl.selected);
    this.resetSelection();
  }

  async registerSelectionAsFavorite() {
    let favoriteStatus;
    let selectedBottles: Bottle[] = this.bottles.filter(btl => btl.selected);
    selectedBottles.forEach(btl => {
      if (favoriteStatus == undefined) {
        favoriteStatus = btl.favorite ? false : true;
      }
      btl.favorite = favoriteStatus;
      delete btl.selected;
    });
    this.bottlesService.update(selectedBottles);
    this.resetSelection();
  }

  /**
   * prend en compte le nouvel état sélectionnée ou pas pour une bouteille
   * @param {Bottle} bottle
   */
  switchSelected(bottle: Bottle) {
    this.nbSelected += bottle.selected ? 1 : -1;
  }

  ionViewWillLeave() {
    this.menuController.close()
  }

  public isSearchVisible(): boolean {
    return this.filterSet.isEmpty() || this.searchBarVisible;
  }

  public showSearchBar() {
    this.searchBarVisible = !this.searchBarVisible;
  }

  public numberOfBottles(): number {
    return this.nbOfBottles;
  }

  public numberOfLots(): number {
    return this.bottles == undefined ? 0 : this.bottles.length;
  }

  public isFiltering() {
    return !this.filterSet.isEmpty()
  }

  filterOnText(event: any) {
    let filter = event.target.value;
    this.filterSet.reset();
    if (filter) {
      this.filterSet.text = filter.split(' ');
    }
    this.bottlesService.filterOn(this.filterSet);
  }

  triggerDetail(bottle: Bottle) {
    this.navCtrl.push(BottleDetailPage, {bottleEvent: {bottles: this.allBottles, bottle: bottle}});
  }

// in case user navigated to here from the home page then we have search param ==> filter on this text
  private initFilterFromNavParams() {
    this.notificationService.debugAlert('BrowsePage.initFilterFromNavParams()');
    if (this.navParams != undefined) {
      if (this.navParams.data[ 'text' ] != null) {
        this.notificationService.debugAlert('BrowsePage.initFilterFromNavParams(' + this.navParams.data[ 'text' ] + ')');
        this.filterSet.text = this.navParams.data[ 'text' ].split(' ');
      } else if (this.navParams.data[ 'filterSet' ] != null) {
        this.filterSet = this.navParams.data[ 'filterSet' ];
      }
    }
  }

  private setFilterSet(filterSet: FilterSet) {
    this.filterSet = filterSet;
    this.searchBarVisible = false;
  }

  private resetSelection() {
    this.bottles.forEach(bottle => bottle.selected = false);
    this.nbSelected = 0;
  }
}
