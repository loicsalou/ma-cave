import {Component, Input} from '@angular/core';

/**
 * Generated class for the IconComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
             selector: 'cav-icon',
             templateUrl: 'icon.component.html'
           })
export class IconComponent {

  @Input() name: 'mail' | 'heart' | 'heart-empty' |    'star' |'star-empty' |'search' | 'home' |'trash-empty' |
    'zoom-in' | 'zoom-out' | 'clock' | 'refresh' | 'down-open' | 'left-open' | 'right-open' | 'up-open' |
    'apps' | 'mail-alt' | 'smile' | 'sad' | 'neutral' | 'sort-alt-up' | 'sort-alt-down' | 'history' | 'sliders' |
    'trash' | 'hourglass-2' | 'hourglass-3' | 'hourglass' | 'facebook-rect' | 'twitter-bird';

  constructor() {
  }

  iconClass() {
    return 'icon-'+this.name;
  }

}
