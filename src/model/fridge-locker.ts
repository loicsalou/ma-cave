/**
 * Created by loicsalou on 01.03.17.
 */
import {BottleSize, Dimension, Locker, LockerType} from './locker';
import {SimpleLocker} from './simple-locker';

export class FridgeLocker extends Locker {

  dimensions: Dimension[]; //dimension L x H
  racks: Locker[];

  constructor(name: string, type: LockerType, dimensions: Dimension[], comment?: string, defaultImage?: string, supportedFormats?: BottleSize[], imageUrl?: string) {
    super(name, type, comment, defaultImage, imageUrl, supportedFormats);
    this.dimensions = dimensions;
    this.initLockers();
  }

  initLockers() {
    this.racks = this.dimensions.map(
      (dimension: Dimension) => new SimpleLocker(this.name + '-1', this.type, dimension)
    )
  }

  getNbOfBottles(): number {
    return this.dimensions.reduce((tot: number, dim: Dimension) => tot += dim.x * dim.y, 0);
  }

  isFridge(): boolean {
    return true;
  }
}
