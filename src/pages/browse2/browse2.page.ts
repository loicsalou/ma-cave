import {Component, OnInit} from "@angular/core";
import {NavController, Platform, ToastController} from "ionic-angular";
import {BottleService} from "../../components/bottle/bottle-firebase.service";
import {Bottle} from "../../components/bottle/bottle";
import {BottleDetailPage} from "../bottle-detail/page-bottle-detail";
import {ListBottleEvent} from "../../components/list/bottle-list-event";
import {FilterSet} from "../../components/distribution/distribution";
import {FirebaseListObservable} from "angularfire2";

@Component({
             selector: 'page-browse',
             templateUrl: 'browse2.page.html',
             styleUrls: [ '/src/pages/browse2/browse2.page.scss' ]
           })
export class Browse2Page implements OnInit {

  bottles_fb: FirebaseListObservable<Bottle[]>;
  bottles: Bottle[];
  distribution = {}; //distribution de la sélection selon plusieurs colonnes pour avoir le compte
  currentDistributionAxis: string[]; //axes de distribution de la distribution courante
  isDistributionOpened = false;
  message: string;
  // ensemble des filtres utilisés pour l'affichage courant: un table d'axes avec pour chacun les valeurs sélectionnées
  // NB: l'axe "Text" représente la recherche textuelle
  filterSet: FilterSet;

  constructor(private toastCtrl: ToastController, public navCtrl: NavController, public platform: Platform,
              private bottlesService: BottleService) {
    this.filterSet = new FilterSet();
    this.bottles_fb = bottlesService.getBottlesObservable();
  }

  setBottles(bottles: FirebaseListObservable<Bottle[]>) {
    this.bottles_fb = bottles;
  }

  ngOnInit() {
    this.bottles_fb.subscribe((bottles: Bottle[]) => {
      this.bottles = bottles;
      console.info('liste rechargée');
    });
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
      ;
    }
    this.bottles = this.bottlesService.getBottlesByFilter(this.filterSet);
    //this.bottles_fb = this.bottlesService.getBottlesObservable();
  }

  refineFilter(filters: FilterSet) {
    filters.text = this.filterSet.text;
    this.filterSet = filters;
    this.bottles_fb = this.bottlesService.getBottlesObservable();
//    this.bottles = this.bottlesService.getBottlesByFilter(filters);
  }

  triggerDetail(bottleEvent: ListBottleEvent) {
    this.navCtrl.push(BottleDetailPage, {bottleEvent: bottleEvent});
  }
}
