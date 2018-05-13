import {Component, Inject} from '@angular/core';
import {NotificationService} from '../../service/notification.service';
import {NativeProvider} from '../../providers/native/native';
import {RackDirective} from '../rack.directive';
import {SimpleLockerComponent} from './simple-locker.component';

/**
 * Generated class for the SimpleLockerComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
             selector: 'place-locker',
             templateUrl: './simple-locker.component.html'
             // styleUrls:[ 'locker.component.scss' ]
           })
export class PlaceLockerComponent extends SimpleLockerComponent {

  constructor(notificationService: NotificationService, nativeProvider: NativeProvider,
              @Inject('GLOBAL_CONFIG') config) {
    super(notificationService, nativeProvider, config);
  }

  public resetComponent() {
    // le place-locker set uniquement à placer la sélection de bouteille. Une fois initialisé il ne doit plus être
    // touché pour ne pas perdre son contenu (les bouteilles n'ont pas de position dans ce locker même si elles s'y
    // trouvent affichées temporairement le temps du placement)
    if (!this.rows) {
      super.resetComponent();
    }
  }
}
