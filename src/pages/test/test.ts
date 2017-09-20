import {ChangeDetectorRef, Component, HostListener, NgZone, ViewChild} from '@angular/core';
import {InfiniteScroll, IonicPage, NavController, VirtualScroll} from 'ionic-angular';

/**
 * Generated class for the TestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
             selector: 'page-test',
             templateUrl: 'test.html',
           })
export class TestPage {
  bigString: string;
  appName = 'Ionic App';
  bottles: Array<any> = [];
  @ViewChild(VirtualScroll) vs: VirtualScroll;

  constructor(public navController: NavController, private cd: ChangeDetectorRef, private ngZone: NgZone) {

    window.onresize = (e) => {
      ngZone.run(() => {
        console.log('resized');
        this.vs.readUpdate(true);
      });
    };

    this.bigString = 'totototo ';
    for (var i = 0; i < 5; i++) {
      this.bigString += this.bigString;
    }
    this.doInfinite(null);
  }

  doInfinite(infiniteScroll: InfiniteScroll) {
    console.log('Begin async operation');

    setTimeout(() => {
      for (var i = 0; i < 50; i++) {
        if (i % 2 == 0) {
          this.bottles.push({front: 'F' + i + this.bigString, back: 'B' + i, flipped: false});
        } else {
          this.bottles.push({front: 'F' + i, back: 'B' + i + this.bigString, flipped: false});
        }

      }
      if (infiniteScroll) {
        console.log('Async operation has ended');
        infiniteScroll.complete();
      }

    }, 500);
  }

  @HostListener('window:resize')
  onResize() {
    this.cd.detectChanges();
    console.log('test');

  }

}
