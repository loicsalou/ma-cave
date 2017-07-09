/**
 * Created by loicsalou on 01.03.17.
 */
import {ImgDefaultable} from '../directives/default-image/img-defaultable';

export class Locker implements ImgDefaultable {

  name: string; // nom du casier
  type: LockerType; // frigo, étagère, filaire...
  material?: LockerMaterial; //utile ? texture plutôt ? à voir
  dimensions: Dimensions; //dimensions L x H x P
  defaultImage: string; // une image par défaut si par d'imageUrl
  bottleSizeCompatibility: BottleSize[]; // liste des formats de bouteilles entreposables dans ce casier
  imageUrl?: string; //Photo éventuelle
  textureUrl?: string; //texture pour représenter la cave
  comment: string; //commentaire utile, emplacement etc.

  getDefaultImageSrc(): string {
    return this.defaultImage;
  }
}

export enum LockerType {
  simple,
  shifted,
  double
}

export enum LockerMaterial {
  wood,
  wire,
  polystyrene,
  fridge,
  stone
}

export interface Dimensions {
  x: number;
  y: number;
  z?: number;
}

export enum BottleSize {
  demie,
  clavelin,
  normale,
  magnum,
  doubleMagnum,
  Jeroboham,
}
