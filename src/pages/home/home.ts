import {Component} from "@angular/core";
import {Platform, NavController, ActionSheetController} from "ionic-angular";
import {BrowsePage} from "../browse/browse.page";
import {Browse2Page} from "../browse2/browse2.page";

@Component({
             selector: 'page-home',
             templateUrl: 'home.html',
             styleUrls: [ '/home.scss' ]
           })
export class HomePage {
  constructor(public navCtrl: NavController, public platform: Platform,
              public actionsheetCtrl: ActionSheetController) {
  }

  manageCellar() {
    // this.navCtrl.push(BrowsePage);
  }

  browseCellar() {
    this.navCtrl.push(Browse2Page);
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
