import {Component} from "@angular/core";
import {Platform, NavController, ActionSheetController} from "ionic-angular";
import {BottleService} from "../browse/bottle.service";

@Component({
  selector: 'page-browse',
  templateUrl: 'browse2.page.html',
  styleUrls: ['/src/pages/browse2/browse2.page.scss']
})
export class Browse2Page {

  bottles;

  constructor(public navCtrl: NavController, public platform: Platform,
              public actionsheetCtrl: ActionSheetController, private bottlesService: BottleService) {
    this.bottles=bottlesService.getBottles();
  }

  filterOn(event: any) {
    let filter=event.target.value
    this.bottles=this.bottlesService.getBottlesByKeywords([filter]);
  }

  openMenu() {
    let actionSheet = this.actionsheetCtrl.create({
      title: 'Filter',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'trash' : null,
          handler: () => {
            console.log('Delete clicked');
          }
        },
        {
          text: 'Share',
          icon: !this.platform.is('ios') ? 'share' : null,
          handler: () => {
            console.log('Share clicked');
          }
        },
        {
          text: 'Play',
          icon: !this.platform.is('ios') ? 'arrow-dropright-circle' : null,
          handler: () => {
            console.log('Play clicked');
          }
        },
        {
          text: 'Favorite',
          icon: !this.platform.is('ios') ? 'heart-outline' : null,
          handler: () => {
            console.log('Favorite clicked');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel', // will always sort to be on the bottom
          icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
}
