import {Component} from "@angular/core";
import {Platform, NavController, ToastController} from "ionic-angular";
import {BottleService} from "../../components/bottle/bottle.service";
import {DistributeService} from "../../components/distribution/distribute.service";

@Component({
  selector: 'page-browse',
  templateUrl: 'browse2.page.html',
  styleUrls: ['/src/pages/browse2/browse2.page.scss']
})
export class Browse2Page {

  bottles;
  distribution; //distribution de la sélection selon plusieurs colonnes pour avoir le compte
  isDistributionOpened = false;

  constructor(private toastCtrl: ToastController, public navCtrl: NavController, public platform: Platform,
              private bottlesService: BottleService, private distributionService: DistributeService) {
    this.bottles = bottlesService.getBottles();
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
    this.distribute(['label', 'subregion_label', 'millesime']);
    //this.presentToast();
  }

  refineFilter(jsonFilter: any) {
    let by = jsonFilter.axis;
    let value = jsonFilter.value;
    this.bottles = this.bottlesService.getBottlesBy(this.bottles, by, value);
    if (by==='subregion_label') {
      this.distribute(['label', 'area_label', 'millesime'])
    } else {
      this.distribute(['label', 'subregion_label', 'millesime']);
    }
  }

  distribute(axis: string[]) {
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
}
