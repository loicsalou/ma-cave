/**
 * Created by loicsalou on 11.07.17.
 */

import {LockerType} from './locker-type';
import {LockerDimension} from './locker-dimension';
import {BottleSize} from './bottle-size';

/**
 * Définit ce qu'est un casier à bouteilles et quel est son contrat de base
 */
export abstract class Locker {

  id: string; // identifiant DB si besoin
  name: string; // nom du casier
  type: LockerType; // normal, décalé ou diamond (en losange)
  defaultImage: string; // une image par défaut si par d'imageUrl
  supportedFormats: BottleSize[]; // liste des formats de bouteilles entreposables dans ce casier
  imageUrl?: string; //Photo éventuelle
  comment: string; //commentaire utile, emplacement etc.
  inFridge = false;

  constructor(id: string, name: string, type: LockerType, comment: string = '', defaultImage: string = '',
              imageUrl: string = '', supportedFormats: BottleSize[], public dimension: LockerDimension, inFridge: boolean) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.defaultImage = defaultImage;
    this.inFridge = inFridge;
    this.supportedFormats = supportedFormats ? supportedFormats : [
      BottleSize.fillette, BottleSize.demie, BottleSize.bouteille, BottleSize.clavelin, BottleSize.piccolo, BottleSize.chopine
    ];
    this.imageUrl = imageUrl;
    this.comment = comment;
  }

  getCapacity(): number {
    return 0;
  }

  abstract isFridge(): boolean;
}

