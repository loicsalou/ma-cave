import {Component, OnInit} from "@angular/core";
import {Loading, LoadingController, NavController, Platform, ToastController} from "ionic-angular";
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
  private _bottles: BehaviorSubject<Bottle[]> = new BehaviorSubject<Bottle[]>([]);
  private bottlesObservable: Observable<Bottle[]> = this._bottles.asObservable();

  bottles: Bottle[];
  message: string;
  filterSet: FilterSet;

  private loading: Loading;

  constructor(private toastCtrl: ToastController, public navCtrl: NavController, public platform: Platform,
              private bottlesService: BottleService, public loadingCtrl: LoadingController) {
    this.filterSet = new FilterSet();
  }

  ngOnInit() {
    this.loading = this.loadingCtrl.create({content: 'Chargement en cours...'});
    this.loading.present();
    this.bottlesService.bottlesObservable.subscribe((bottles: Bottle[]) => {
      if (bottles && bottles.length > 0) {
        this.setBottles(bottles);
        this.loading.dismiss();
      }
    });
    this.bottlesService.filtersObservable.subscribe(filterSet => this.setFilterSet(filterSet))
  }

  public isFiltering() {
    return ! this.filterSet.isEmpty()
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
    this.bottlesService.filterOn(this.filterSet);
  }

  triggerDetail(bottleEvent: ListBottleEvent) {
    bottleEvent.bottles = this.bottlesObservable;
    this.navCtrl.push(BottleDetailPage, {bottleEvent: bottleEvent});
  }

  private setFilterSet(filterSet: FilterSet) {
    this.filterSet=filterSet;
  }
}
