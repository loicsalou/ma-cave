import {Component, Input, OnInit} from '@angular/core';

/**
 * Generated class for the RatingComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
             selector: 'rating',
             templateUrl: 'rating.html'
           })
export class RatingComponent implements OnInit {
  @Input()
  size: number;

  ratingSize: number[];

  constructor() {
  }

  ngOnInit() {
    this.ratingSize = new Object[ this.size ].fill(0);
  }
}
