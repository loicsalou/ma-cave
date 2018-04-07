import {Component, Input} from '@angular/core';

@Component({
             selector: 'progress-bar',
             templateUrl: 'progress-bar.html'
             // styleUrls:[ 'progress-bar.scss' ]
           })
export class ProgressBarComponent {

  @Input('progress') progress;
  @Input('thickness') thickness: string;
  @Input('showPercentage') showPercentage: boolean = false;

  constructor() {
  }

}

export enum ProgressBarStyle {
  thin = 0,
  regular = 1,
  thick = 2
}
