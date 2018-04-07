import {Component, OnInit, ViewChild} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {BottleSize, Locker, LockerType} from '../../../model/locker';
import {Bottle} from '../../../model/bottle';
import {NotificationService} from '../../../service/notification.service';
import {LockerComponent} from '../../../components/locker/locker.component';
import {BottlePersistenceService} from '../../../service/bottle-persistence.service';
import {SimpleLockerComponent} from '../../../components/locker/simple-locker.component';
import {FridgeLockerComponent} from '../../../components/locker/fridge-locker.component';

/**
 * Generated class for the LockerEditorComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
             selector: 'locker-editor2',
             templateUrl: 'update-locker.page.html',
             // styleUrls:[ 'update-locker.page.scss' ]
           })
export class UpdateLockerPage implements OnInit {

  @ViewChild('lockerCmp') lockerComponent: LockerComponent;

  lockerFormats: BottleSize[];
  name: string;
  comment: string;
  supportedFormats: BottleSize[];
  type: LockerType;
  locker: Locker;
  lockerContent: Bottle[];

  constructor(private params: NavParams,
              private bottlesService: BottlePersistenceService, private notificationService: NotificationService,
              private navCtrl: NavController) {
  }

  ngOnInit(): void {
    if (this.params.data) {
      this.locker = this.params.data[ 'locker' ];
      this.lockerContent = this.params.data[ 'content' ].filter(
        bottle => bottle.positions.filter(
          pos => pos.inLocker(this.locker.id)).length > 0
      );
    }
  }

  isLockerEditable(): boolean {
    return (this.lockerComponent instanceof SimpleLockerComponent) ||
      (this.lockerComponent instanceof FridgeLockerComponent && (<FridgeLockerComponent>this.lockerComponent).anyRackSelected())
  }

  isFridge(): boolean {
    return this.type === LockerType.fridge;
  }

  cancel() {
    this.notificationService.information('update.cancelled');
    this.navCtrl.pop();
  }

  saveLocker() {
    this.bottlesService.updateLockerAndBottles(this.lockerContent, this.locker);
    this.navCtrl.pop();
  }

  private getDefaultSupportedFormats(): BottleSize[] {
    return this.lockerFormats.slice(0, 6);
  }
}
