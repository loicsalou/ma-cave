import {Component, OnInit} from '@angular/core';
import {IonicPage} from 'ionic-angular';
import {Locker} from '../../model/locker';
import {FirebaseCellarService} from '../../service/firebase-cellar.service';

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
             styleUrls: ['/cellar.page.scss']
           })
export class CellarPage implements OnInit {

  private otherLockers: Locker[];
  private chosenLocker: Locker;

  constructor(private cellarService: FirebaseCellarService) {
  }

  ngOnInit(): void {
    this.cellarService.allLockersObservable.subscribe(
      lockers => this.otherLockers = lockers
    );
    this.cellarService.fetchAllLockers();
  }

  chooseLocker(locker: Locker) {
    if (this.chosenLocker !== undefined) {
      this.otherLockers.push(this.chosenLocker);
    }
    this.otherLockers = this.otherLockers.filter(item => item.name !== locker.name);
    this.chosenLocker = locker;
  }
}
