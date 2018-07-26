import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams} from '@ionic/angular';
import {BottleSize, Dimension, Locker, LockerType} from '../../../model/locker';
import {NgForm} from '@angular/forms';
import {FridgeLocker} from '../../../model/fridge-locker';
import {CellarPersistenceService} from '../../../service/cellar-persistence.service';
import {SimpleLocker} from '../../../model/simple-locker';

/**
 * Generated class for the LockerEditorComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
             templateUrl: './create-locker-page.html'
             // styleUrls:[ 'create-locker-page.scss' ]
           })
export class CreateLockerPage {

  lockerTypes: LockerType[] = [
    LockerType.shifted,
    LockerType.diamond,
    LockerType.fridge,
    LockerType.simple
  ];
  lockerFormats: BottleSize[] = [
    BottleSize.piccolo,
    BottleSize.chopine,
    BottleSize.fillette,
    BottleSize.demie,
    BottleSize.clavelin,
    BottleSize.bouteille,
    BottleSize.litre,
    BottleSize.magnum,
    BottleSize.jeroboham,
    BottleSize.rehoboram,
    BottleSize.mathusalem,
    BottleSize.salmanazar,
    BottleSize.balthazar,
    BottleSize.nabuchodonozor,
    BottleSize.melchior
  ];
  name: string;
  comment: string;
  supportedFormats: BottleSize[];
  type: LockerType;
  lockerDimension: Dimension;
  fridgeDimension: Dimension;
  fridgeLockersDimensions: Dimension[] = [];

  @ViewChild('lockerForm') bottleForm: NgForm;

  constructor(private navController: NavController, params: NavParams, private cellarService: CellarPersistenceService) {
    this.lockerDimension = CreateLockerPage.getDefaultLockerDimensions();
    this.fridgeDimension = CreateLockerPage.getDefaultLockerDimensions();
    this.changeFridgeDimension();
    this.supportedFormats = this.getDefaultSupportedFormats();
  }

  private static getDefaultLockerDimensions(): Dimension {
    return <Dimension>{x: 4, y: 4};
  }

  private static getDefaultFridgeDimensions(): Dimension {
    // pour l'instant en tout cas je considère qu'il n'y a qu'une colonne dans un frigo ce qui est le cas en principe
    // la largeur ne sera donc pas éditable au moins dans un premier temps
    return <Dimension>{x: 1, y: 5};
  }

  private static getDefaultFridgeLockersDimensions(): Array<Dimension> {
    let def = new Array(CreateLockerPage.getDefaultFridgeDimensions().y);
    def.fill(CreateLockerPage.getDefaultFridgeDimensions());
    return <Dimension[]>def;
  }

  isFridge(): boolean {
    return this.type === LockerType.fridge;
  }

  saveLocker() {
    let locker: Locker;
    if (this.type === LockerType.fridge) {
      //name: string, type: LockerType, dimensions: Dimension[], comment?: string, defaultImage?: string,
      // supportedFormats?: BottleSize[], imageUrl?: string
      locker = new FridgeLocker(undefined, this.name, this.type, this.fridgeLockersDimensions, this.comment, this.supportedFormats);
    } else {
      locker = new SimpleLocker(undefined, this.name, this.type, this.lockerDimension, false, this.comment, this.supportedFormats);
    }
    this.cellarService.createLocker(locker);
    this.navController.pop();
  }

  cancelCreation() {
    this.navController.pop();
  }

  changeFridgeDimension() {
    while (this.fridgeDimension.y > this.fridgeLockersDimensions.length) {
      this.fridgeLockersDimensions.push(CreateLockerPage.getDefaultFridgeDimensions());
    }
    this.fridgeLockersDimensions = this.fridgeLockersDimensions.slice(0, this.fridgeDimension.y);
  }

  private getDefaultSupportedFormats(): BottleSize[] {
    return this.lockerFormats.slice(0, 6);
  }
}
