import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavController, NavParams, Platform, ToastController} from 'ionic-angular';
import {BottleService} from '../../components/bottle/bottle-firebase.service';
import {Bottle} from '../../components/bottle/bottle';
import {BottleDetailPage} from '../bottle-detail/page-bottle-detail';
import {ListBottleEvent} from '../../components/list/bottle-list-event';
import {FilterSet} from '../../components/distribution/distribution';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subscription} from 'rxjs/Subscription';

@Component({
             selector: 'page-browse',
             templateUrl: 'browse.page.html',
             styleUrls: [ '/src/pages/browse/browse.page.scss' ]
           })
export class BrowsePage implements OnInit, OnDestroy {
  private bottleSubscription: Subscription;
  private filterSubscription: Subscription;
  private searchBarVisible: boolean = false;
  private _bottles: BehaviorSubject<Bottle[]> = new BehaviorSubject<Bottle[]>([]);
  private bottlesObservable: Observable<Bottle[]> = this._bottles.asObservable();
  bottles: Bottle[];

  filterSet: FilterSet;
  private navParams: NavParams;

  constructor(private toastCtrl: ToastController, public navCtrl: NavController, public platform: Platform,
              private bottlesService: BottleService, params?: NavParams) {
    this.filterSet = new FilterSet();
    this.navParams = params;
  }

  ngOnInit() {
    console.info('initializing browse page instance');
    this.bottleSubscription = this.bottlesService.bottlesObservable.subscribe(
      (bottles: Bottle[]) => {
        this.setBottles(bottles);
        if (bottles && bottles.length > 0) {
          this.checkNavigationParams();
        }
      },
      error => this.showMessage('error ! ' + error),
      () => this.showMessage('completed!')
    );
    this.filterSubscription = this.bottlesService.filtersObservable.subscribe(filterSet => this.setFilterSet(filterSet));
  }

  ngOnDestroy(): void {
    console.info('destroying browse page instance');
    this.filterSubscription.unsubscribe();
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
  private checkNavigationParams() {
    if (this.navParams != undefined && this.navParams.data[ 'text' ] != null) {
      this.filterSet.text = this.navParams.data[ 'text' ].split(' ');
      this.navParams.data[ 'text' ] = undefined;
      setTimeout(() => this.bottlesService.filterOn(this.filterSet), 10);
    }
  }

  public isSearchVisible(): boolean {
    return this.filterSet.isEmpty() || this.searchBarVisible;
  }

  public showSearchBar() {
    this.searchBarVisible = true;
  }

  public numberOfBottles(): number {
    return this.bottles == undefined ? 0 : this.bottles.length;
  }

  public isFiltering() {
    return !this.filterSet.isEmpty()
  }

  private setBottles(bottles: Bottle[ ]) {
    this.bottles = bottles;
    this._bottles.next(this.bottles);
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
    bottleEvent.bottles = this.bottlesObservable;
    this.navCtrl.push(BottleDetailPage, {bottleEvent: bottleEvent});
  }

  private setFilterSet(filterSet: FilterSet) {
    this.filterSet = filterSet;
    this.searchBarVisible = false;
  }
}
