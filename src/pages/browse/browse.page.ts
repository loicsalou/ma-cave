import {Component, OnInit} from "@angular/core";
import {Loading, LoadingController, NavController, NavParams, Platform, ToastController} from "ionic-angular";
import {BottleService} from "../../components/bottle/bottle-firebase.service";
import {Bottle} from "../../components/bottle/bottle";
import {BottleDetailPage} from "../bottle-detail/page-bottle-detail";
import {ListBottleEvent} from "../../components/list/bottle-list-event";
import {FilterSet} from "../../components/distribution/distribution";
import {Observable} from "rxjs/Observable";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Component({
             selector: 'page-browse',
             templateUrl: 'browse.page.html',
             styleUrls: [ '/src/pages/browse/browse.page.scss' ]
           })
export class BrowsePage implements OnInit {
  private searchBarVisible: boolean = false;
  private _bottles: BehaviorSubject<Bottle[]> = new BehaviorSubject<Bottle[]>([]);
  private bottlesObservable: Observable<Bottle[]> = this._bottles.asObservable();
  bottles: Bottle[];

  message: string;
  filterSet: FilterSet;
  private loading: Loading;
  private navParams: NavParams;

  constructor(private toastCtrl: ToastController, public navCtrl: NavController, public platform: Platform,
              private bottlesService: BottleService, public loadingCtrl: LoadingController, params?: NavParams) {
    this.filterSet = new FilterSet();
    this.navParams = params;
  }

  ngOnInit() {
    this.showLoading();
    this.bottlesService.bottlesObservable.subscribe((bottles: Bottle[]) => {
      if (bottles && bottles.length > 0) {
        this.setBottles(bottles);
        this.dismissLoading();
        this.checkNavigationParams();
        console.info(Date.now()+" - received "+bottles.length+" bottles");
      }
    });
    this.bottlesService.filtersObservable.subscribe(filterSet => this.setFilterSet(filterSet));
  }

  private showLoading() {
    this.loading = this.loadingCtrl.create({
                                             content: 'Chargement en cours...',
                                             dismissOnPageChange: false
                                           });
    this.loading.present();
  }

  // in case user navigated to here from the home page then we have search param ==> filter on this text
  private checkNavigationParams() {
    if (this.navParams != undefined && this.navParams.data[ 'text' ] != null) {
      this.filterSet.text = this.navParams.data[ 'text' ].split(' ');
      this.navParams.data[ 'text' ] = undefined;
      //this.showLoading();
      this.bottlesService.filterOn(this.filterSet);
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

  private setBottles(bottles: Bottle[]) {
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

  private dismissLoading() {
    if (this.loading != undefined) {
      this.loading.dismiss();
      this.loading=undefined;
    }

  }
}
