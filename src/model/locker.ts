/**
 * Created by loicsalou on 11.07.17.
 */

import {ImgDefaultable} from '../directives/default-image/img-defaultable';
/**
 * Définit ce qu'est un casier à bouteilles et quel est son contrat de base
 */
export class Locker implements ImgDefaultable {

  name: string; // nom du casier
  type: LockerType; // normal, décalé ou diamond (en losange)
  defaultImage: string; // une image par défaut si par d'imageUrl
  supportedFormats: BottleSize[]; // liste des formats de bouteilles entreposables dans ce casier
  imageUrl?: string; //Photo éventuelle
  comment: string; //commentaire utile, emplacement etc.

  constructor(name: string, type: LockerType, comment?: string, defaultImage?: string, imageUrl?: string, supportedFormats?: BottleSize[]) {
    this.name = name;
    this.type = type;
    this.defaultImage = defaultImage;
    this.supportedFormats = supportedFormats ? supportedFormats : [
      BottleSize.fillette, BottleSize.demie, BottleSize.bouteille, BottleSize.clavelin, BottleSize.piccolo, BottleSize.chopine
    ];
    this.imageUrl = imageUrl;
    this.comment = comment;
  }

  getDefaultImageSrc(): string {
    return this.defaultImage;
  }

  getNbOfBottles(): number {
    return 0;
  }
}

export enum LockerType {
  simple,
  shifted,
  diamond,
  fridge
}

export interface Dimension {
  x: number;
  y: number;
}

export enum BottleSize {
  piccolo = .2,
  chopine = .25,
  fillette = .375,
  demie = .5,
  clavelin = .62,
  bouteille = .75,
  litre = 1,
  magnum = 1.5,
  jeroboham = 3,
  rehoboram = 4.5,
  mathusalem = 6,
  salmanazar = 9,
  balthazar = 12,
  nabuchodonozor = 15,
  melchior = 18
}
