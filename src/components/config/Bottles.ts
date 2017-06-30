/**
 * Created by loicsalou on 08.03.17.
 */
import {Injectable} from '@angular/core';

@Injectable()
export class Bottles {

  public static colorsData = require('../../assets/json/colors.json');
  public static regionsData = require('../../assets/json/regions.json');
  public static aocData = require('../../assets/json/regions-appellations.json');

  public colors = [];
  public aocByArea = [];

  constructor() {
    this.initColors();
    this.initAoc();
  }

  private initColors() {
    for (let key in Bottles.colorsData) {
      this.colors.push({key: key, value: Bottles.colorsData[ key ]});
    }
    this.colors.sort((a, b) => a.value > b.value ? 1 : -1);
  }

  private initAoc() {
    for (let key in Bottles.aocData) {
      this.aocByArea.push({key: key, value: this.extractAocInfo(Bottles.aocData[ key ])});
    }
    this.aocByArea.sort((a, b) => a.key > b.key ? 1 : -1);
  }

  private extractAocInfo(data: any): AocInfo[] {
    return data.map(aoc => {
      return {
        'subdivision': aoc.Subdivisions,
        'appellation': aoc.Appellations,
        'types': aoc[ 'Type de vins produit' ],
        'dryness': aoc[ 'Teneur en sucre' ]
      }
    })
      .sort((a: AocInfo, b: AocInfo) => a.appellation > b.appellation ? 1 : -1);
  }
}

export interface AocInfo {
  //ex: Libournais, Basse-Bourgogne...
  subdivision;
  // ex: chablis, chablis grand cru...
  appellation;
  //ex: rouge, blanc...
  types;
  //ex: Liquoreux, moëlleux...
  dryness;
}
