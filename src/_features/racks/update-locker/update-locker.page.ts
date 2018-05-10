import {Component, OnInit, ViewChild} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {BottleSize, Locker} from '../../../model/locker';
import {Bottle} from '../../../model/bottle';
import {NotificationService} from '../../../service/notification.service';
import {LockerComponent} from '../../../components/locker/locker.component';
import {BottlePersistenceService} from '../../../service/bottle-persistence.service';
import {SimpleLockerComponent} from '../../../components/locker/simple-locker.component';
import {FridgeLockerComponent} from '../../../components/locker/fridge-locker.component';
import {FridgeLocker} from '../../../model/fridge-locker';
import {SimpleLocker} from '../../../model/simple-locker';
import {UpdateLockerAction} from '../../../app/state/bottles.actions';
import {ApplicationState} from '../../../app/state/app.state';
import {Store} from '@ngrx/store';
import {BottlesQuery} from '../../../app/state/bottles.state';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs/Observable';

/**
 * Generated class for the LockerEditorComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
             selector: 'locker-editor2',
             templateUrl: 'update-locker.page.html'
             // styleUrls:[ 'update-locker.page.scss' ]
           })
export class UpdateLockerPage implements OnInit {

  @ViewChild('lockerCmp') lockerComponent: LockerComponent;

  lockerFormats: BottleSize[];
  name: string;
  comment: string;
  supportedFormats: BottleSize[];
  lockerAndBottles$: Observable<{ locker: Locker, lockerContent: Bottle[ ] }>;

  private locker: Locker;
  private lockerContent: Bottle[];

  constructor(private params: NavParams,
              private bottlesService: BottlePersistenceService,
              private notificationService: NotificationService,
              private navCtrl: NavController,
              private store: Store<ApplicationState>) {
  }

  ngOnInit(): void {
    // on récupère le locker édité et les crus qui ont au moins une bouteille dans ce locker
    // on ne le prend qu'une fois pour éviter les refresh inutiles et qui posent problème
    this.lockerAndBottles$ = this.store.select(BottlesQuery.getEditLockerAndBottles).pipe(
      //take(1),
      map((data: { locker: Locker, bottles: Bottle[ ] }) => {
            this.locker = this.cloneLocker(data.locker);
            this.lockerContent = this.cloneContent(data.bottles);
            return {locker: this.locker, lockerContent: this.lockerContent};
          }
      )
    );
  }

  isLockerEditable(): boolean {
    return (this.lockerComponent instanceof SimpleLockerComponent) ||
      (this.lockerComponent instanceof FridgeLockerComponent && (<FridgeLockerComponent>this.lockerComponent).anyRackSelected());
  }

  cancel() {
    this.notificationService.information('update.cancelled');
    this.navCtrl.pop();
  }

  saveLocker() {
    this.store.dispatch(new UpdateLockerAction(this.locker, this.lockerContent));
    this.navCtrl.pop();
  }

  private getDefaultSupportedFormats(): BottleSize[] {
    return this.lockerFormats.slice(0, 6);
  }

  private cloneContent(content: Bottle[]): Bottle[] {
    return content.map(
      (bottle: Bottle) => {
        return new Bottle({...bottle, positions: [ ...bottle.positions ], metadata: {...bottle.metadata}});
      }
    );
  }

  private cloneLocker(paramlocker: Locker): Locker {
    let cloned: Locker;
    if (paramlocker instanceof FridgeLocker) {
      cloned = new FridgeLocker(paramlocker.id, paramlocker.name, paramlocker.type,
                                [ ...paramlocker.dimensions ],
                                paramlocker.comment, paramlocker.supportedFormats,
                                paramlocker.defaultImage, paramlocker.imageUrl);
    } else {
      cloned = new SimpleLocker(paramlocker.id, paramlocker.name, paramlocker.type,
                                {...paramlocker.dimension}, paramlocker.inFridge,
                                paramlocker.comment, paramlocker.supportedFormats,
                                paramlocker.defaultImage, paramlocker.imageUrl);
    }
    //cloned = Object.assign(cloned, paramlocker);
    return cloned;
  }
}
