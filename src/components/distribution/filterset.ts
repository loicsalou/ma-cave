import {SortOption} from './distribution';

export class FilterSet {
  text?: string[];
  subregion_label?: string[];
  area_label?: string[];
  label?: string[];
  classe_age?: string[];
  millesime?: string[];
  history = false;
  private _favoriteOnly = false;
  private _overdueOnly = false;
  private _placed = true;
  private _toBePlaced = true;
  private _sortOption: SortOption;

  constructor(text?: string[]) {
    this.text = text;
  }

  get favoriteOnly(): boolean {
    return this._favoriteOnly;
  }

  set favoriteOnly(value: boolean) {
    this._favoriteOnly = value;
  }

  get overdueOnly(): boolean {
    return this._overdueOnly;
  }

  set overdueOnly(value: boolean) {
    this._overdueOnly = value;
  }

  get placed(): boolean {
    return this._placed;
  }

  set placed(value: boolean) {
    this._placed = value;
  }

  get toBePlaced(): boolean {
    return this._toBePlaced;
  }

  set toBePlaced(value: boolean) {
    this._toBePlaced = value;
  }

  get sortOption(): SortOption {
    return this._sortOption;
  }

  set sortOption(value: SortOption) {
    this._sortOption = value;
  }

  hasText() {
    return this.text && this.text.length > 0;
  }

  hasRegions() {
    return this.subregion_label && this.subregion_label.length > 0;
  }

  hasAppellations() {
    return this.area_label && this.area_label.length > 0;
  }

  hasCouleurs() {
    return this.label && this.label.length > 0;
  }

  hasAges() {
    return this.classe_age && this.classe_age.length > 0;
  }

  hasMillesimes() {
    return this.millesime && this.millesime.length > 0;
  }

  switchHistory() {
    this.history = !this.history;
  }

  switchFavorite() {
    this._favoriteOnly = !this._favoriteOnly;
  }

  switchOverdue() {
    this._overdueOnly = !this._overdueOnly;
  }

  /**
   * empty si aucun filtrage en place susceptible de changer la liste chargée de la base.
   * A noter le "favoriteOnly" ne permet que de se concentrer sur les bouteilles favorites. Si il est à false one ne
   * se préoccupe pas du status favotire ou pas de la bouteille.
   * @returns {boolean}
   */
  isEmpty() {
    return (!this.favoriteOnly && !this.overdueOnly && !this.hasText() && !this.hasAppellations() && !this.hasAges() &&
      !this.hasCouleurs() && !this.hasMillesimes() && !this.hasRegions() && this.history && this._placed &&
      this._toBePlaced);
  }

  reset() {
    this.text = undefined;
    this.area_label = undefined;
    this.label = undefined;
    this.classe_age = undefined;
    this.millesime = undefined;
    this.subregion_label = undefined;
    this.favoriteOnly = false;
    this.overdueOnly = false;
    this.placed = true;
    this.toBePlaced = true;
  }

  toString() {
    return JSON.stringify(this);
  }

  setSortOption(sortOption: SortOption) {
    this._sortOption = sortOption;
  }
}
