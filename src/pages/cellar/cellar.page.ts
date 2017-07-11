import {Component, OnInit, ViewChild} from '@angular/core';
import {IonicPage, Slides} from 'ionic-angular';
import {SimpleLocker} from '../../model/simple-locker';
import {FirebaseCellarService} from '../../service/firebase-cellar.service';
import {Locker} from '../../model/locker';
import {Cell} from '../../components/locker/locker.component';

/**
 * Generated class for the CellarPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
             selector: 'page-cellar',
             templateUrl: './cellar.page.html',
             styleUrls: [ '/cellar.page.scss' ]
           })
export class CellarPage implements OnInit {

  private otherLockers: Locker[];
  private chosenLocker: Locker;
  private paginatedLocker: Locker;
  @ViewChild(Slides) slides: Slides;
  private selectedCell: Cell;

  constructor(private cellarService: FirebaseCellarService) {
  }

  ngOnInit(): void {
    this.cellarService.allLockersObservable.subscribe(
      lockers => {
        this.otherLockers = lockers;
        this.resetPaginatedLocker();
      }
    );
    this.cellarService.fetchAllLockers();
  }

  resetPaginatedLocker() {
    if (this.otherLockers.length > 0) {
      let ix = this.slides.getActiveIndex();
      if (ix==undefined) ix=0;
      this.paginatedLocker = this.otherLockers[ ix ];
    }
  }

  chooseLocker(locker: SimpleLocker) {
    if (this.chosenLocker !== undefined) {
      this.otherLockers.push(this.chosenLocker);
    }
    this.otherLockers = this.otherLockers.filter(item => item.name !== locker.name);
    this.chosenLocker = locker;
    this.resetPaginatedLocker();
  }

  slideChanged() {
    this.resetPaginatedLocker();
  }

  cellSelected(cell: Cell) {
    if (cell) {
      this.selectedCell = cell;
    }
  }
}
