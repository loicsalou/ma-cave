/**
 * Created by loicsalou on 01.03.17.
 */
import {BottleSize, Dimension, Locker, LockerType} from './locker';

/**
 * un SimpleLocker est un casier à bouteilles "simple", ce qui signifie qu'il se définit seulement grâce à sa
 * largeur et sa hauteur l x h. Les bouteilles sont organisées en rangées et sont alignées par colonnes ou parfois
 * avec un décalage (lignes paires et impaires décalées les unes par rapport aux autres).
 * L'exemple typique est le casier en plastique, ou le casier filaire en métal.
 */
export class SimpleLocker extends Locker {

  dimension: Dimension; //dimension L x H

  constructor(name: string, type: LockerType, dimension: Dimension, comment?: string, defaultImage?: string, imageUrl?: string, supportedFormats?: BottleSize[]) {
    super(name, type, comment, defaultImage, imageUrl, supportedFormats);
    this.dimension = dimension;
  }

  getNbOfBottles(): number {
    return this.dimension.x * this.dimension.y;
  }

  isFridge(): boolean {
    return false;
  }
}
