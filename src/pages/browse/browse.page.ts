import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavController, NavParams, Platform} from 'ionic-angular';
import {BottleService} from '../../service/firebase-bottle.service';
import {Bottle} from '../../model/bottle';
import {BottleDetailPage} from '../bottle-detail/page-bottle-detail';
import {ListBottleEvent} from '../../components/list/bottle-list-event';
import {FilterSet} from '../../components/distribution/distribution';
import {Subscription} from 'rxjs/Subscription';
import * as _ from 'lodash';
import {LoginService} from '../../service/login.service';
import {HomePage} from '../home/home';
import {NotificationService} from '../../service/notification.service';

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

  filterSet: FilterSet = new FilterSet();
  private navParams: NavParams;
  private nbOfBottles: number = 0;

  constructor(public navCtrl: NavController, public platform: Platform, private bottlesService: BottleService,
              private loginService: LoginService, private notificationService: NotificationService, params?: NavParams) {
    this.navParams = params;
  }

  ngOnInit() {
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
        this.bottles = [];
        this.nbOfBottles = 0;
        _.chunk(received, 30).forEach(
          (chunk: any[], ix) => {
            this.notificationService.traceInfo('itération ' + ix + ' Traitement des bouteilles reçues après timeout' +
                                               chunk.length);
            setTimeout(
              () => {
                this.notificationService.traceInfo('Dans l\'itération ' + ix + ' Traitement des bouteilles reçues' +
                                                   ' après timeout ' + chunk.length);
                this.nbOfBottles += chunk.reduce(
                  (tot: number, btl2: Bottle) => tot + +btl2.quantite_courante,
                  0
                );
                this.bottles = _.concat(this.bottles, chunk);
              }, ix * 50
            )
          }
        )
      },
      error => this.notificationService.error('Erreur lors de l\'accès à la base de données' + error),
      () => this.notificationService.traceInfo('Récupération de ' + this.nbOfBottles + ' bouteilles terminée')
    );
  }

  ngOnDestroy(): void {
    this.notificationService.traceInfo('Libération de la page de browse');
    this.bottleSubscription.unsubscribe();
  }

  logout() {
    this.loginService.logout();
    this.navCtrl.push(HomePage);
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
