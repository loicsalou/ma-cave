import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NavController, NavParams, Platform} from 'ionic-angular';
import {BottlePersistenceService} from '../../service/bottle-persistence.service';
import {Bottle} from '../../model/bottle';
import {BottleDetailPage} from '../bottle-detail/page-bottle-detail';
import {ListBottleEvent} from '../../components/list/bottle-list-event';
import {FilterSet} from '../../components/distribution/distribution';
import {Subscription} from 'rxjs/Subscription';
import * as _ from 'lodash';
import {LoginService} from '../../service/login.service';
import {NotificationService} from '../../service/notification.service';
import {CellarPage} from '../cellar/cellar.page';
import {BottleListComponent} from '../../components/list/bottle-list.component';
import {TranslateService} from '@ngx-translate/core';
import {NativeProvider} from '../../providers/native/native';

@Component({
             selector: 'page-browse',
             templateUrl: 'browse.page.html',
             styleUrls: [ '/src/pages/browse/browse.page.scss' ]
           })
export class BrowsePage implements OnInit, OnDestroy {
  private bottleSubscription: Subscription;
  private filterSubscription: Subscription;
  private searchBarVisible: boolean = false;
  bottles: Bottle[];

  filterSet: FilterSet = new FilterSet(this.translateService);
  private navParams: NavParams;
  private nbOfBottles: number = 0;

  @ViewChild('bottleList')
  listComponent: BottleListComponent;

  constructor(public navCtrl: NavController, public platform: Platform, private bottlesService: BottlePersistenceService,
              private loginService: LoginService, private notificationService: NotificationService,
              private translateService: TranslateService, private nativeProvider: NativeProvider, params?: NavParams) {
    this.navParams = params;
  }

  ngOnInit() {
    this.nativeProvider.feedBack();
    this.notificationService.traceInfo('Initialisation de la page de browse');
    this.setFilter();
    this.filterSubscription = this.bottlesService.filtersObservable.subscribe(
      filterSet => {
        this.notificationService.traceInfo('Nouveau filtre reçu: ' + filterSet);
        this.setFilterSet(filterSet);
      });
    this.bottleSubscription = this.bottlesService.filteredBottlesObservable.subscribe(
      (received: Bottle[]) => {
        this.notificationService.traceInfo('Réception des bouteilles');
        this.bottles = received;
        this.nbOfBottles = 0;
        if (received) {
          this.nbOfBottles = received.reduce(
            (tot: number, btl: Bottle) => tot + +btl.quantite_courante,
            0
          );
        }
        if (this.filterSet && this.filterSet.sortOption) {
          this.bottles = _.orderBy(this.bottles,
                                   [ this.filterSet.sortOption.sortOn, 'country_label', 'subregion_label', 'area_label', 'nomCru', 'millesime' ],
                                   [ this.filterSet.sortOption.sortOrder == undefined ? 'asc' : this.filterSet.sortOption.sortOrder, 'asc', 'asc', 'asc', 'asc', 'asc' ]
          );
        } else {
          this.bottles = _.orderBy(this.bottles, [ 'country_label', 'subregion_label', 'area_label', 'nomCru', 'millesime' ],
                                   [ 'asc', 'asc', 'asc', 'asc', 'asc' ]
          );
        }
      },
      error => this.notificationService.error('Erreur lors de l\'accès à la base de données' + error),
      () => this.notificationService.traceInfo('Récupération de ' + this.nbOfBottles + ' bouteilles terminée')
    );
  }

  ngOnDestroy(): void {
    this.notificationService.traceInfo('Libération de la page de browse');
    this.bottleSubscription.unsubscribe();
    this.filterSubscription.unsubscribe();
  }

  logout() {
    this.loginService.logout();
    this.navCtrl.popToRoot();
  }

  anyBottleSelected(): boolean {
    return this.listComponent.anyBottleSelected();
  }

  placeSelection() {
    let selectedBottles = this.bottles.filter(btl => btl.selected);
    this.navCtrl.push(CellarPage, {bottlesToPlace: selectedBottles});
    selectedBottles.forEach(btl => delete btl.selected);
    this.listComponent.resetSelection();
  }

  locateSelection() {
    let selectedBottles = this.bottles.filter(btl => btl.selected);
    this.navCtrl.push(CellarPage, {bottlesToHighlight: selectedBottles});
    selectedBottles.forEach(btl => delete btl.selected);
    this.listComponent.resetSelection();
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
    this.listComponent.resetSelection();
  }

// in case user navigated to here from the home page then we have search param ==> filter on this text
  private setFilter() {
    this.notificationService.traceInfo('Vérification des paramètres du filtre');
    if (this.navParams != undefined) {
      if (this.navParams.data[ 'text' ] != null) {
        this.filterSet.text = this.navParams.data[ 'text' ].split(' ');
      } else if (this.navParams.data[ 'filterSet' ] != null) {
        this.filterSet = this.navParams.data[ 'filterSet' ];
      }
    }
    this.bottlesService.filterOn(this.filterSet);
  }

  public isSearchVisible(): boolean {
    return this.filterSet.isEmpty() || this.searchBarVisible;
  }

  public showSearchBar() {
    this.searchBarVisible = true;
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

  triggerDetail(bottleEvent: ListBottleEvent) {
    this.navCtrl.push(BottleDetailPage, {bottleEvent: bottleEvent});
  }

  private setFilterSet(filterSet: FilterSet) {
    this.filterSet = filterSet;
    this.searchBarVisible = false;
  }
}

function compare(a: Bottle, b: Bottle) {
  if (a.country_label > b.country_label) {
    return 1
  } else if (b.country_label > a.country_label) {
    return -1
  } else if (a.subregion_label > b.subregion_label) {
    return 1
  } else if (b.subregion_label > a.subregion_label) {
    return -1
  } else if (a.area_label > b.area_label) {
    return 1
  } else if (b.area_label > a.area_label) {
    return -1
  } else if (a.nomCru > b.nomCru) {
    return 1
  } else if (b.nomCru > a.nomCru) {
    return -1
  } else if (a.millesime > b.millesime) {
    return 1
  } else if (b.millesime > a.millesime) {
    return -1;
  }
  return 0;
}
