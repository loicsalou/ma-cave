/**
 * Created by loicsalou on 01.03.17.
 */
import {Locker} from './locker';
import {SimpleLocker} from './simple-locker';
import {LockerType} from './locker-type';
import {LockerDimension} from './locker-dimension';
import {BottleSize} from './bottle-size';

export class FridgeLocker extends Locker {

  dimensions: LockerDimension[]; //dimension L x H
  racks: Locker[];

  constructor(id: string, name: string, type: LockerType, dimensions: LockerDimension[], comment?: string,
              supportedFormats?: BottleSize[], defaultImage?: string, imageUrl?: string) {
    super(id, name, type, comment, defaultImage, imageUrl, supportedFormats, {x: 1, y: dimensions.length}, false);
    this.dimensions = dimensions;
    this.initLockers();
  }

  initLockers() {
    this.racks = this.dimensions.map(
      (dimension: LockerDimension, i: number) => new SimpleLocker(this.id, this.id + '-' + (i + 1), LockerType.shifted, dimension, true)
    )
  }

  getCapacity(): number {
    return this.dimensions.reduce((tot: number, dim: LockerDimension) => tot += dim.x * dim.y, 0);
  }

  isFridge(): boolean {
    return true;
  }
}
