import {Component, OnInit, ViewChild} from '@angular/core';
import {DistributeService} from '../distribution/distribute.service';
import {Chart} from 'chart.js';
import {BottleService} from '../bottle/bottle-firebase.service';
import {Bottle} from '../bottle/bottle';
import * as _ from 'lodash';

/**
 * Generated class for the StatisticsComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
             selector: 'statistics',
             templateUrl: 'statistics.html'
           })
export class StatisticsComponent implements OnInit {
  //axes de distribution de la distribution courante
  static DEFAULT_AXIS = [ 'label', 'subregion_label', 'classe_age' ];
  static STANDARD_COLORS = [
    'grey', 'black', 'blue', 'red', 'orange', 'aqua', 'aquamarine', 'blueviolet', 'green', 'cornsilk', 'fuchsia'
  ];
  static COLORS_BY_WINECOLOR = {
    'autres': 'grey',
    'blanc': '#f7f7d4',
    'blanc effervescent': '#b3e87d',
    'blanc liquoreux': '#f99806',
    'blanc moëlleux': '#ffffcc',
    'cognac': '#c76605',
    'rosé': '	#e619e6',
    'rosé effervescent': '#b946b9',
    'rouge': '#e61919',
    'vin blanc muté': '#9e662e',
    'vin de paille': '#ffbf00',
    'vin jaune': '#ffff00'
  };

  totalNumberOfBottles: number = 0;

  @ViewChild('doughnutColors') doughnutColors;
  colorsDoughnut: any;

  @ViewChild('doughnutRegions') doughnutRegions;
  regionsDoughnut: any;
  private regionsDistribution: Distribution;

  bottles: Bottle[];
  chartVisible = false;

  constructor(private distributionService: DistributeService, private bottlesService: BottleService) {
  }

  ngOnInit(): void {
    this.bottlesService.bottlesObservable.subscribe((bottles: Bottle[]) => this.bottles = bottles.filter(btl => +btl.quantite_courante > 0));
  }

  generateCharts() {
    this.createCharts(this.bottles);
    this.chartVisible = true;
  }

  private createCharts(bottles: Bottle[]) {
    let distribution: Distribution[] = this.distributionService.distributeBy(bottles, StatisticsComponent.DEFAULT_AXIS);
    console.info('distribution de ' + bottles.length + ' faite');
    if (bottles.length !== 0) {
      this.totalNumberOfBottles = bottles.length;
      this.createColorChart(distribution[ 0 ]);
      this.createRegionChart(distribution[ 1 ]);
    }
  }

  createColorChart(distribution: Distribution) {
    if (!distribution || !this.doughnutColors) {
      return;
    }

    //on enlève regroupe les bouteilles représentant un pourcentage inférieur au seuil minimal d'importance
    let significantData = this.reduceDistributionToSignificant(distribution, 0.02, 4);
    //on extrait les indexes (couleur du vin par ex)
    let axis = significantData.map(kv => kv.key);
    //on affecte les couleurs des portions du chart
    let colors = axis.map(colorname => StatisticsComponent.COLORS_BY_WINECOLOR[ colorname ]);
    //les borders sont gris
    let borderColors: string[] = new Array(axis.length);
    borderColors = _.fill(borderColors, 'grey');
    //on extrait les valeurs correspondantes (rouge, blanc par ex)
    let values = significantData.map(kv => kv.value);
    this.colorsDoughnut = new Chart(this.doughnutColors.nativeElement, {

      type: 'doughnut',
      data: {
        labels: axis,
        datasets: [ {
          label: '# bouteilles',
          data: values,
          backgroundColor: colors,
          borderColor: borderColors,
          borderWidth: .5
        } ]
      },
      options: {
        legend: {
          display: true,
          labels: {
            boxWidth: 15,
            fontSize: 8,
            fontColor: 'black',
            padding: 5
          }
        }
      }

    });
  }

  createRegionChart(distribution: Distribution) {
    if (!distribution || !this.doughnutRegions) {
      return;
    }

    //on enlève regroupe les bouteilles représentant un pourcentage inférieur au seuil minimal d'importance
    let significantData = this.reduceDistributionToSignificant(distribution, 0.02, 4);
    //on extrait les indexes (couleur du vin par ex)
    let axis = significantData.map(kv => kv.key);
    //on affecte les couleurs des portions du chart
    let colors = axis.map((colorname, i) => StatisticsComponent.STANDARD_COLORS[ i % StatisticsComponent.STANDARD_COLORS.length ]);
    //les borders sont gris
    let borderColors: string[] = new Array(axis.length);
    borderColors = _.fill(borderColors, 'grey');
    //on extrait les valeurs correspondantes (rouge, blanc par ex)
    let values = significantData.map(kv => kv.value);

    this.regionsDoughnut = new Chart(this.doughnutRegions.nativeElement, {

      type: 'doughnut',
      data: {
        labels: axis,
        datasets: [ {
          label: '# bouteilles',
          data: values,
          backgroundColor: colors,
          borderColor: borderColors,
          borderWidth: .5
        } ]
      },
      options: {
        legend: {
          display: true,
          labels: {
            boxWidth: 15,
            fontSize: 8,
            fontColor: 'black',
            padding: 5
          }
        }
      }

    });
  }

  /**
   * returns a shortened distribution so every portion of the graph is visible and significant.
   * @param distribution the Distribution object
   * @param minPercent minimum percentage below which a value becomes non significant
   * @param onlyTop number of highest values to be in the chart
   * @returns {KeyValue[]}
   */
  private reduceDistributionToSignificant(distribution: Distribution, minPercent: number, onlyTop: number): KeyValue[] {
    let nonSignificantNumber = 0
    if (onlyTop < 1 || minPercent > 1 || minPercent < 0) {
      throw new RangeError('onlyTop must be > 0, minPercent must be >= 0 and <=1');
    }
    //Firstly keep only values greater than minimum admitted
    let significantData = distribution.values.filter((value: KeyValue) => {
      let keep = value.value / this.totalNumberOfBottles > minPercent;
      if (!keep) {
        nonSignificantNumber += value.value
      }
      return keep;
    });

    _.orderBy(significantData, [ 'value' ], [ 'desc' ]);
    let tailToConsolidate = significantData.length > onlyTop ? _.slice(significantData, onlyTop) : [];
    let tot = tailToConsolidate.reduce((kv1: KeyValue, kv2: KeyValue) => kv1.value + kv2.value, 0) | 0;
    nonSignificantNumber += tot;
    significantData = _.slice(significantData, 0, onlyTop);

    if (nonSignificantNumber > 0) {
      significantData.push(<KeyValue> {key: 'autres', value: nonSignificantNumber});
    }

    return significantData;
  }
}
