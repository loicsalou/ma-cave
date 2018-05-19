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

  constructor(id: string, name: string, type: LockerType, dimension: Dimension, inFridge ?: boolean, comment?: string, supportedFormats?: BottleSize[],
              defaultImage?: string, imageUrl?: string) {
    super(id, name, type, comment, defaultImage, imageUrl, supportedFormats, dimension, inFridge);
  }

  getCapacity(): number {
    return this.dimension.x * this.dimension.y;
  }

  isFridge(): boolean {
    return false;
  }
}
