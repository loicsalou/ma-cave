/**
 * Created by loicsalou on 15.03.17.
 */
import {Bottle} from '../bottle/bottle';
import {Observable} from 'rxjs/Observable';
/**
 * Evénement de sélection d'une bouteille dans la liste.
 * Contient les attributs
 * - bottle: la liste de bouteilles
 * - bottle: la bouteille
 * - index: l'index de la bouteille choisie dans la liste, permet de se positionner directement dessus dnas les slides
 */
export declare class ListBottleEvent {
  bottles: Observable<Bottle[]>;
  bottle: Bottle;
  index: number;
}
