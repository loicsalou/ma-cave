import {Component} from '@angular/core';
import {SearchCriteria} from '../../service/firebase-connection.service';
import {ViewController} from 'ionic-angular';

@Component({
             selector: 'items-page',
             template: `
               <ion-list>
                 <ion-list-header>{{'dashboard.usual-queries' | translate}}</ion-list-header>
                 <button ion-item (click)="choose(item)" *ngFor="let item of items">{{present(item.keywords)}}</button>
               </ion-list>`
           })
export class PopoverPage {

  items: SearchCriteria[];

  constructor(public viewCtrl: ViewController) {
    this.items = viewCtrl.data;
  }

  choose(item: SearchCriteria) {
    this.viewCtrl.dismiss(item.keywords);
  }

  present(itemKeywords: string[]): string {
    if (itemKeywords) {
      return itemKeywords.join(' ')
    } else {
      return ''
    }
  }
}
