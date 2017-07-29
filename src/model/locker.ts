/**
 * Created by loicsalou on 11.07.17.
 */

import {ImgDefaultable} from '../directives/default-image/img-defaultable';

/**
 * Définit ce qu'est un casier à bouteilles et quel est son contrat de base
 */
export abstract class Locker implements ImgDefaultable {

  private _id: string; // identifiant DB si besoin
  name: string; // nom du casier
  type: LockerType; // normal, décalé ou diamond (en losange)
  defaultImage: string; // une image par défaut si par d'imageUrl
  supportedFormats: BottleSize[]; // liste des formats de bouteilles entreposables dans ce casier
  imageUrl?: string; //Photo éventuelle
  comment: string; //commentaire utile, emplacement etc.

  currentSize = LockerSize.medium;

  constructor(name: string, type: LockerType, comment: string = '', defaultImage: string = '', imageUrl: string = '', supportedFormats: BottleSize[]) {
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

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  abstract isFridge(): boolean;

  abstract increaseSize();

  abstract decreaseSize();
}

export enum LockerType {
  diamond,
  fridge,
  shifted,
  simple

}

export interface Dimension {
  x: number;
  y: number;
}

export enum BottleSize {
  piccolo,
  chopine,
  fillette,
  demie,
  clavelin,
  bouteille,
  litre,
  magnum,
  jeroboham,
  rehoboram,
  mathusalem,
  salmanazar,
  balthazar,
  nabuchodonozor,
  melchior
}

export enum LockerSize {
  small, medium, big, huge
}
