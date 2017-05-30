import {Component, OnInit} from '@angular/core';
import {ActionSheetController, NavController, Platform} from 'ionic-angular';
import {BrowsePage} from '../browse/browse.page';

@Component({
             selector: 'page-home',
             templateUrl: 'home.html',
             styleUrls: [ '/home.scss' ]
           })
export class HomePage implements OnInit {
  version: any;

  constructor(public navCtrl: NavController, public platform: Platform,
              public actionsheetCtrl: ActionSheetController) {
  }

  ngOnInit(): void {
    this.version = require('../../../package.json').version;
  }

  filterOnText(event: any) {
    let text = event.target.value;
    if (text != undefined && text.length != 0) {
      this.navCtrl.push(BrowsePage, {
        text: text
      })
    }
    ;
  }

  manageCellar() {
    // this.navCtrl.push(BrowsePage);
  }

  browseCellar() {
    this.navCtrl.push(BrowsePage);
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
