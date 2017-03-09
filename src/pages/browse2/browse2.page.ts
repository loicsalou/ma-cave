import {Component} from "@angular/core";
import {Platform, NavController, ActionSheetController, ToastController} from "ionic-angular";
import {BottleService} from "../browse/bottle.service";
import {DistributeService} from "../../components/distribution/distribute.service";

@Component({
  selector: 'page-browse',
  templateUrl: 'browse2.page.html',
  styleUrls: ['/src/pages/browse2/browse2.page.scss']
})
export class Browse2Page {

  bottles;
  distribution; //distribution de la sélection selon plusieurs colonnes pour avoir le compte

  constructor(private toastCtrl: ToastController, public navCtrl: NavController, public platform: Platform,
              private bottlesService: BottleService, private distributionService: DistributeService) {
    this.bottles=bottlesService.getBottles();
  }

  filterOn(event: any) {
    let filter=event.target.value
    this.bottles=this.bottlesService.getBottlesByKeywords([filter]);
    this.distribution=this.distributionService.distributeBy(this.bottles,['label', 'subregion_label', 'area_label', 'millesime']);
    //this.presentToast();
  }

  refine($event) {
    let by='label';
    let value=$event;
    this.bottles=this.bottlesService.getBottlesBy(this.bottles, by, value);
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: (this.bottles && this.bottles.length > 0) ? this.bottles.length+' bouteilles trouvées' : 'Aucune bouteille ne correspond',
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
