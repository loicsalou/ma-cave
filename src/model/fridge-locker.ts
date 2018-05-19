/**
 * Created by loicsalou on 01.03.17.
 */
import {BottleSize, Dimension, Locker, LockerType} from './locker';
import {SimpleLocker} from './simple-locker';

export class FridgeLocker extends Locker {

  dimensions: Dimension[]; //dimension L x H
  racks: Locker[];

  constructor(id: string, name: string, type: LockerType, dimensions: Dimension[], comment?: string,
              supportedFormats?: BottleSize[], defaultImage?: string, imageUrl?: string) {
    super(id, name, type, comment, defaultImage, imageUrl, supportedFormats, {x: 1, y: dimensions.length}, false);
    this.dimensions = dimensions;
    this.initLockers();
  }

  initLockers() {
    this.racks = this.dimensions.map(
      (dimension: Dimension, i: number) => new SimpleLocker(this.id, this.id + '-' + (i + 1), LockerType.shifted, dimension, true)
    )
  }

  getCapacity(): number {
    return this.dimensions.reduce((tot: number, dim: Dimension) => tot += dim.x * dim.y, 0);
  }

  isFridge(): boolean {
    return true;
  }
}
