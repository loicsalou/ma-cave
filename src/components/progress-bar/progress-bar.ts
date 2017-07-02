import {Component, Input} from '@angular/core';

@Component({
             selector: 'progress-bar',
             templateUrl: 'progress-bar.html',
             styleUrls: [ '/progress-bar.scss' ]
           })
export class ProgressBarComponent {

  @Input('progress') private progress;
  @Input('thickness') private thickness: string;
  @Input('showPercentage') private showPercentage: boolean = false;

  constructor() {
  }

}

export enum ProgressBarStyle {
  thin = 0,
  regular = 1,
  thick = 2
}
