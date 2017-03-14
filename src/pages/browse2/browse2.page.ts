import {Component, OnInit} from "@angular/core";
import {Platform, NavController, ToastController} from "ionic-angular";
import {BottleService} from "../../components/bottle/bottle.service";
import {DistributeService} from "../../components/distribution/distribute.service";
import * as _ from "lodash";
import {Bottle} from "../../components/bottle/bottle";
import {BottleDetailPage} from "../bottle-detail/bottle-detail";

@Component({
  selector: 'page-browse',
  templateUrl: 'browse2.page.html',
  styleUrls: ['/src/pages/browse2/browse2.page.scss']
})
export class Browse2Page implements OnInit {

  bottles: Bottle[];
  distribution; //distribution de la sélection selon plusieurs colonnes pour avoir le compte
  currentDistributionAxis: string[]; //axes de distribution de la distribution courante
  isDistributionOpened = false;
  message: string;

  constructor(private toastCtrl: ToastController, public navCtrl: NavController, public platform: Platform,
              private bottlesService: BottleService, private distributionService: DistributeService) {

  }

  setBottles(bottles: Bottle[]) {
    this.bottles=bottles;
  }

  ngOnInit() {
    this.bottles=this.bottlesService.getBottles();
    /*
    this.bottlesService.getBottles().subscribe(
      bottles => this.setBottles(bottles),
      error => this.message="ERROR !",
      () => this.message="complete"
    );
    */
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
    let filter = event.target.value
    this.bottles = this.bottlesService.getBottlesByKeywords([filter]);
    this.distribute(['label', 'subregion_label', 'classe_age']);
    //this.presentToast();
  }

  refineFilter(jsonFilter: any) {
    let by = jsonFilter.axis;
    let value = jsonFilter.value;
    this.bottles = this.bottlesService.getBottlesBy(this.bottles, by, value);
    if (by === 'subregion_label') {
      let targetDistribution=_.without(this.currentDistributionAxis, 'subregion_label');
      targetDistribution.push('area_label');
      this.distribute(targetDistribution);
    } else if (by === 'classe_age') {
      let targetDistribution=_.without(this.currentDistributionAxis, 'classe_age');
      targetDistribution.push('millesime');
      this.distribute(targetDistribution);
    } else {
      this.distribute(this.currentDistributionAxis);
    }
  }

  distribute(axis: string[]) {
    this.currentDistributionAxis = axis;
    this.distribution = this.distributionService.distributeBy(this.bottles, axis);
  }


  presentToast() {
    let toast = this.toastCtrl.create({
      message: (this.bottles && this.bottles.length > 0) ? this.bottles.length + ' bouteilles trouvées' : 'Aucune bouteille ne correspond',
      duration: 3000,
      position: 'bottom',
      showCloseButton: true
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  triggerDetail(bottle: Bottle) {
    console.info("show detail "+bottle['nomCru']);
    this.navCtrl.push(BottleDetailPage, {bottle: bottle});
  }
}
