import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavController, NavParams, Platform, ToastController} from 'ionic-angular';
import {BottleService} from '../../components/bottle/bottle-firebase.service';
import {Bottle} from '../../components/bottle/bottle';
import {BottleDetailPage} from '../bottle-detail/page-bottle-detail';
import {ListBottleEvent} from '../../components/list/bottle-list-event';
import {FilterSet} from '../../components/distribution/distribution';
import {Subscription} from 'rxjs/Subscription';
import {Statistics} from '../../components/bottle/statistics';
import * as _ from 'lodash';

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

  constructor(private toastCtrl: ToastController, public navCtrl: NavController, public platform: Platform,
              private bottlesService: BottleService, private stats: Statistics, params?: NavParams) {
    this.navParams = params;
  }

  ngOnInit() {
    this.trace('initializing browse page instance');
    this.setFilter();
    this.filterSubscription = this.bottlesService.filtersObservable.subscribe(
      filterSet => {
        this.trace('receiving filter');
        this.setFilterSet(filterSet);
      });
    this.bottleSubscription = this.bottlesService.filteredBottlesObservable.subscribe(
      (received: Bottle[]) => {
        this.trace('receiving bottles');
        this.bottles = [];
        this.nbOfBottles = 0;
        _.chunk(received, 30).forEach(
          (chunk: any[], ix) => {
            this.trace('iteration ' + ix + ' processing bottles after timeout ' + chunk.length);
            setTimeout(
              () => {
                this.trace('inside iteration ' + ix + ' processing bottles after timeout ' + chunk.length);
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
      error => this.showMessage('error ! ' + error),
      () => this.showMessage('completed!')
    );
  }

  ngOnDestroy(): void {
    this.trace('destroying browse page instance');
    //this.filterSubscription.unsubscribe();
    this.bottleSubscription.unsubscribe();
  }

  private showMessage(s: string) {
    let basketToast = this.toastCtrl.create({
                                              message: s,
                                              cssClass: 'information-message',
                                              showCloseButton: true
                                            });
    basketToast.present();
  }

  // in case user navigated to here from the home page then we have search param ==> filter on this text
  private setFilter() {
    this.trace('checking nav params');
    if (this.navParams != undefined && this.navParams.data[ 'text' ] != null) {
      this.filterSet.text = this.navParams.data[ 'text' ].split(' ');
    }
    this.bottlesService.filterOn(this.filterSet);
  }

  private trace(text: string) {
    console.info(text);
  }

  public isSearchVisible(): boolean {
    return this.filterSet.isEmpty() || this.searchBarVisible;
  }

  public showSearchBar() {
    this.searchBarVisible = true;
  }

  public numberOfBottles(): number {
    return this.nbOfBottles;
    //return this.bottles == undefined ? 0 : this.bottles.length;
  }

  public numberOfLots(): number {
    return this.bottles == undefined ? 0 : this.bottles.length;
  }

  public isFiltering() {
    return !this.filterSet.isEmpty()
  }

  private setBottles(bottles: Bottle[ ]) {
    this.bottles = bottles;
  }

  filterOnText(event: any) {
    let filter = event.target.value;
    this.filterSet.reset();
    if (filter) {
      this.filterSet.text = filter.split(' ');
    }
    //this.showLoading();
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
