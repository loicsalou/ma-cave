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
             templateUrl: 'browse2.page.html',
             styleUrls: [ '/src/pages/browse2/browse2.page.scss' ]
           })
export class Browse2Page implements OnInit {
  private _bottles: BehaviorSubject<Bottle[]> = new BehaviorSubject<Bottle[]>([]);
  private bottlesObservable: Observable<Bottle[]> = this._bottles.asObservable();

  bottles: Bottle[];
  distribution = {}; //distribution de la sélection selon plusieurs colonnes pour avoir le compte
  currentDistributionAxis: string[]; //axes de distribution de la distribution courante
  isDistributionOpened = false;
  message: string;
  // ensemble des filtres utilisés pour l'affichage courant: un table d'axes avec pour chacun les valeurs sélectionnées
  // NB: l'axe "Text" représente la recherche textuelle
  filterSet: FilterSet;
  private loading: Loading;

  constructor(private toastCtrl: ToastController, public navCtrl: NavController, public platform: Platform,
              private bottlesService: BottleService, public loadingCtrl: LoadingController) {
    this.filterSet = new FilterSet();
  }

  ngOnInit() {
    this.loading = this.loadingCtrl.create({content: 'Chargement en cours...'});
    this.loading.present();
    this.bottlesService.getBottlesObservable().subscribe((bottles: Bottle[]) => {
      if (bottles && bottles.length > 0) {
        this.setBottles(bottles);
        this.loading.dismiss();
        console.info('nombre éléments: ' + this.bottles.length);
      }
    });
  }

  private setBottles(bottles: Bottle[]) {
    this.bottles = bottles;
    this._bottles.next(this.bottles);
  }

  trace(bottles: Bottle[]) {
    bottles.forEach((bottle: Bottle) =>
                      console.info(bottle[ 'nomCru' ] + ': ' + bottle[ 'label' ])
    );
  }

  switchDistribution() {
    this.isDistributionOpened = !this.isDistributionOpened;
  }

  openDistribution() {
    this.isDistributionOpened = true;
  }

  closeDistribution() {
    this.isDistributionOpened = false;
  }

  filterOnText(event: any) {
    let filter = event.target.value;
    this.filterSet.reset();
    if (filter) {
      this.filterSet.text = filter.split(' ');
    }
    this.setBottles(this.bottlesService.getBottlesByFilter(this.filterSet));
    //this.bottles_fb = this.bottlesService.getBottlesObservable();
  }

  refineFilter(filters: FilterSet) {
    filters.text = this.filterSet.text;
    this.filterSet = filters;
    //this.bottles_fb = this.bottlesService.getBottlesObservable();
    this.setBottles(this.bottlesService.getBottlesByFilter(filters));
  }

  triggerDetail(bottleEvent: ListBottleEvent) {
    bottleEvent.bottles = this.bottlesObservable;
    this.navCtrl.push(BottleDetailPage, {bottleEvent: bottleEvent});
  }
}
