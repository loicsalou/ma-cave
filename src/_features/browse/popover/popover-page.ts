import {Component} from '@angular/core';
import {IonicPage, ViewController} from 'ionic-angular';
import {SearchCriteria} from '../../../model/search-criteria';
import {Observable} from 'rxjs';

@IonicPage()
@Component({
             template: `
               <div class="inner">
                 <ion-list>
                   <ion-list-header>
                     <ion-title>{{'dashboard.usual-queries' | translate}}</ion-title>
                   </ion-list-header>
                   <div *ngFor="let item of items$ | async" style="display: flex; align-items: center;">
                     <button ion-item (click)="choose(item)" class="flex-grow">
                       <span class="flex-grow">{{present(item.keywords)}}</span>
                     </button>
                     <ion-icon name="trash" (click)="removeSearch($event, item)" style="padding:5px"></ion-icon>
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
