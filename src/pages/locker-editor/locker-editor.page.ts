import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavParams} from 'ionic-angular';
import {BottleSize, Dimension, Locker, LockerType} from '../../model/locker';
import {NgForm} from '@angular/forms';
import {FridgeLocker} from '../../model/fridge-locker';
import {CellarPersistenceService} from '../../service/cellar-persistence.service';
import {SimpleLocker} from '../../model/simple-locker';

/**
 * Generated class for the LockerEditorComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@IonicPage()
@Component({
             selector: 'locker-editor',
             templateUrl: './locker-editor.page.html',
             styleUrls: [ '/locker-editor.page.scss' ]
           })
export class LockerEditorPage {

  lockerTypes: LockerType[];
  lockerFormats: BottleSize[];

  @ViewChild('lockerForm') bottleForm: NgForm;

  name: string;
  comment: string;
  supportedFormats: BottleSize[];
  type: LockerType;
  //locker normal
  lockerDimension: Dimension;
  private locker: Locker;

  //locker composite (ex. frigo)
  private fridge: FridgeLocker;
  fridgeDimension: Dimension;

  fridgeLockersDimensions: Dimension[]=[];

  constructor(params: NavParams, private cellarService: CellarPersistenceService) {
    this.lockerTypes = [
      LockerType.shifted,
      LockerType.diamond,
      LockerType.fridge,
      LockerType.simple
    ];
    this.lockerFormats = [
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
    this.lockerDimension = LockerEditorPage.getDefaultLockerDimensions();
    this.fridgeDimension = LockerEditorPage.getDefaultLockerDimensions();
    this.changeFridgeDimension();
    this.supportedFormats = this.getDefaultSupportedFormats();
  }

  test() {
    console.info();
  }

  isFridge(): boolean {
    return this.type === LockerType.fridge;
  }

  private getDefaultSupportedFormats(): BottleSize[] {
    return this.lockerFormats.slice(0, 6);
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
  }

  changeFridgeDimension() {
    while (this.fridgeDimension.y > this.fridgeLockersDimensions.length) {
      this.fridgeLockersDimensions.push(LockerEditorPage.getDefaultFridgeDimensions());
    }
    this.fridgeLockersDimensions=this.fridgeLockersDimensions.slice(0,this.fridgeDimension.y);
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
    let def = new Array(LockerEditorPage.getDefaultFridgeDimensions().y);
    def.fill(LockerEditorPage.getDefaultFridgeDimensions());
    return <Dimension[]>def;
  }
}
