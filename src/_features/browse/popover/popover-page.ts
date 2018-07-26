import {Component} from '@angular/core';
import {SearchCriteria} from '../../../model/search-criteria';
import {Observable} from 'rxjs';
import {ViewController} from '@ionic/core';

@Component({
             template: `
               <div class="inner">
                 <ion-list>
                   <ion-list-header>
                     <ion-label></ion-label>
                     <ion-title>{{'dashboard.usual-queries' | translate}}</ion-title>
                   </ion-list-header>
                   <div *ngFor="let item of items$ | async" style="display: flex; align-items: center;">
                     <ion-item>
                       <ion-label></ion-label>
                       <button (click)="choose(item)" class="flex-grow">
                         <span class="flex-grow">{{present(item.keywords)}}</span>
                       </button>
                       <cav-icon name="trash" (click)="removeSearch($event, item)"></cav-icon>
                       <!--<ion-icon name="trash" (click)="removeSearch($event, item)" style="padding:5px"></ion-icon>-->
                     </ion-item>
                   </div>
                 </ion-list>
               </div>`
             // styleUrls:[ 'popover-page.scss' ]
           })
export class PopoverPage {

  items$: Observable<SearchCriteria[]>;

  constructor(public viewCtrl: ViewController) {
    this.items$ = viewCtrl.data;
  }

  choose(item: SearchCriteria) {
    this.viewCtrl.dismiss({name: 'select', param: item.keywords});
  }

  removeSearch(event: Event, item: SearchCriteria) {
    event.preventDefault();
    this.viewCtrl.dismiss({name: 'remove', param: item.keywords});
  }

  present(itemKeywords: string[]): string {
    if (itemKeywords) {
      return itemKeywords.join(' ');
    } else {
      return '';
    }
  }
}
