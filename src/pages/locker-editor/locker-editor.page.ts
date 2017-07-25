import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavParams} from 'ionic-angular';
import {BottleSize, Dimension, Locker, LockerType} from '../../model/locker';
import {NgForm} from '@angular/forms';
import {FridgeLocker} from '../../model/fridge-locker';

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

  lockerTypes: string[];
  lockerFormats: string[];

  @ViewChild('lockerForm') bottleForm: NgForm;

  name: string;
  comment: string;
  supportedFormats: string[];
  type;
  //locker normal
  lockerDimension: Dimension;
  private locker: Locker;

  //locker composite (ex. frigo)
  private fridge: FridgeLocker;
  fridgeDimension: Dimension;

  fridgeLockersDimensions: Dimension[];

  constructor(params: NavParams) {
    this.lockerTypes = Reflect.ownKeys(LockerType).filter((value: string) => isNaN(+value)).map(value => value.toString());
    this.lockerFormats = Reflect.ownKeys(BottleSize).filter(
      (value: string) => isNaN(+value)
    ).map(value => value.toString());
    this.lockerDimension = LockerEditorPage.getDefaultLockerDimensions();
    this.fridgeDimension = LockerEditorPage.getDefaultLockerDimensions();
    this.fridgeLockersDimensions = LockerEditorPage.getDefaultFridgeLockersDimensions();
    this.supportedFormats = this.getDefaultSupportedFormats();
  }

  test() {
    console.info();
  }

  private getDefaultSupportedFormats(): string[] {
    return this.lockerFormats.slice(0, 6);
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
