 /**
  * Created by loicsalou on 23.04.17.
  */
 import {Bottle} from "../components/bottle/bottle";

export interface DBModel {
  bottles: {
    [bottleId: number]: Bottle
  }
}
