/**
 * Created by loicsalou on 01.03.17.
 */
import {ImgDefaultable} from '../directives/default-image/img-defaultable';

export class Bottle implements ImgDefaultable {

  id?: string;
  classe_age?: string;
  favorite?: boolean;
  area_label: string;
  canal_vente: string;
  comment: string;
  cote: string;
  country_label: string;
  date_achat: string;
  garde_max: string;
  garde_min: string;
  garde_optimum: string;
  label: string;
  lastUpdated: number;
  lieu_achat: string;
  millesime: string;
  nomCru: string;
  positions?: Position[]; // positions auxquelles les bouteilles du lot sont placées
  prix: string;
  profile_image_url?: string;
  image_urls?: string[];
  quantite_achat: string;
  quantite_courante: number;
  subregion_label: string;
  selected?: boolean;
  suggestion: string;
  volume: string;
  metadata?: BottleMetadata;
  defaultImage ?: string;
  overdue?: boolean;

  constructor(jsonOrBottle: Object) {
    Object.assign(this, jsonOrBottle);
    if (jsonOrBottle[ '$key' ]) {
      this.id = jsonOrBottle[ '$key' ];
      if (this.id === undefined) {
        this.id = null;
      }
    }
    this.selected = false;
  }

  getDefaultImageSrc(): string {
    return this.defaultImage;
  }

  numberToBePlaced(): number {
    return this.quantite_courante - this.positions.length
  }

  addNewPosition(position: Position) {
    this.positions.push(position);
  }

  removeFromPosition(position: Position) {
    this.positions = this.positions.filter(pos => !pos.equals(position));
  }

  equals(bottle: Bottle) {
    if (!bottle) {
      return false;
    }
    return this.id === bottle.id;
  }
}

export interface BottleMetadata {
  area_label: string;
  area_label_search: string;
  nomCru: string;
  subregion_label: string;
  keywords: string[];
  secondaryKeywords: string[];
}

export class Position {
  lockerId: string;
  rack: number = 0;
  x: number;
  y: number;

  constructor(lockerId: string, x: number, y: number, rack: number = 0) {
    this.lockerId = lockerId;
    this.rack = rack;
    this.x = x;
    this.y = y;
  }

  public equals(pos: Position): boolean {
    if (!pos) {
      return false
    }
    return (pos.lockerId === this.lockerId &&
      pos.x === this.x &&
      pos.y === this.y &&
      pos.rack === this.rack
    )
  }

  /**
   * vérifie si la position est une sous-position d'un casier.
   * @param {string} id
   */
  inLocker(id: string): boolean {
    return this.lockerId === id;
  }

  /**
   * vérifie si la position est une sous-position d'un rack.
   * @param {string} id
   * @param {number} rack peut être undefined, auquel cas la position sourant doit aussi avoir undefined comme rack
   */
  inRack(id: string, rack: number): boolean {
    return this.lockerId === id && this.rack === rack;
  }
}
