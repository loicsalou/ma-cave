import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DistributeService} from '../../service/distribute.service';
import {Chart, ChartElement} from 'chart.js';
import {BottleService} from '../../service/firebase-bottle.service';
import {Bottle} from '../../model/bottle';
import * as _ from 'lodash';
import {FilterSet} from '../distribution/distribution';
import {NavController} from 'ionic-angular';
import {BrowsePage} from '../../pages/browse/browse.page';
import {ChartComponent, ChartEvent} from '../chart/chart.component';

/**
 * Generated class for the StatisticsComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
             selector: 'statistics',
             templateUrl: './statistics.component.html'
           })
export class StatisticsComponent implements OnInit {
// axes de distribution de la distribution courante
  @Input()
  axis: string;
  @Input()
  legend: string = 'none';
  @Input()
  topMost: number = 6;
  @Input()
  type: string = 'bar';

  @Output()
  filterApplied: EventEmitter<FilterSet> = new EventEmitter<FilterSet>();

  ready = false;

  static STANDARD_COLORS = [
    'blue', 'red', 'orange', 'aqua', 'aquamarine', 'blueviolet', 'green', 'cornsilk', 'fuchsia', 'grey', 'black'
  ];
  static COLORS_BY_WINECOLOR = {
    'autres': 'grey',
    'blanc': '#f7f7d4',
    'blanc effervescent': '#b3e87d',
    'blanc liquoreux': '#f99806',
    'blanc moëlleux': '#ffffcc',
    'cognac': '#c76605',
    'rosé': '#e619e6',
    'rosé effervescent': '#b946b9',
    'rouge': '#e61919',
    'vin blanc muté': '#9e662e',
    'vin de paille': '#ffbf00',
    'vin jaune': '#ffff00'
  };

  totalNumberOfBottles: number = 0;
  private totalNumberOfLots: number;

  // Doughnut
  public chartLabels: string[];
  public chartData: number[];
  public chartType: string = 'doughnut';
  public chartColors: string[] = [];
  public chartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    legend: {
      position: this.legend ? this.legend : 'none'
    }
  };

  constructor(private distributionService: DistributeService, private bottlesService: BottleService, private nav: NavController) {
  }

  ngOnInit(): void {
    this.bottlesService.allBottlesObservable.subscribe((bottles: Bottle[]) => {
      this.createChart(bottles.filter(btl => +btl.quantite_courante > 0));
    });
  }

  private createChart(bottles: Bottle[]) {
    let distribution: Distribution[] = this.distributionService.distributeBy(bottles, [ this.axis ]);
    if (bottles.length !== 0) {
      this.totalNumberOfLots = bottles.length;
      this.totalNumberOfBottles = bottles.reduce((tot: number, btl: Bottle) => tot + +btl.quantite_courante, 0);
      if (this.axis == 'label') {
        this.createLabelColorChart(distribution[ 0 ]);
        this.ready = true;
      }
      else if (this.axis == 'subregion_label') {
        this.createRegionColorChart(distribution[ 0 ]);
        this.ready = true;
      }
    }
  }

  createLabelColorChart(distribution: Distribution) {
    if (!distribution) {
      return;
    }

    //on enlève / regroupe les bouteilles représentant un pourcentage inférieur au seuil minimal d'importance
    let significantData = this.reduceDistributionToSignificant(distribution, 0.02, this.topMost);
    //on extrait les indexes (couleur du vin par ex)
    this.chartLabels = significantData.map(kv => kv.key);
    //on affecte les couleurs des portions du chart
    this.chartColors = this.chartLabels.map(colorname => StatisticsComponent.COLORS_BY_WINECOLOR[ colorname ]);
    //les borders sont gris
    let borderColors: string[] = new Array(this.chartLabels.length);
    borderColors = _.fill(borderColors, 'grey');
    //on extrait les valeurs correspondantes (rouge, blanc par ex)
    this.chartData = significantData.map(kv => kv.value);
  }

  createRegionColorChart(distribution: Distribution) {
    if (!distribution) {
      return;
    }

    //on enlève / regroupe les bouteilles représentant un pourcentage inférieur au seuil minimal d'importance
    let significantData = this.reduceDistributionToSignificant(distribution, 0.02, this.topMost);
    //on extrait les indexes (couleur du vin par ex)
    this.chartLabels = significantData.map(kv => kv.key);
    //on affecte les couleurs des portions du chart
    this.chartColors = StatisticsComponent.STANDARD_COLORS;
    //les borders sont gris
    let borderColors: string[] = new Array(this.chartLabels.length);
    borderColors = _.fill(borderColors, 'grey');
    //on extrait les valeurs correspondantes (rouge, blanc par ex)
    this.chartData = significantData.map(kv => kv.value);
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

  // events
  public chartClicked(chartEvent: ChartEvent): void {
    if (chartEvent) {
      let axis = chartEvent.axis;
      let axisValue = chartEvent.axisValue;
      let fs: FilterSet = new FilterSet();
      fs[ axis ] = [ axisValue ];

      this.filterApplied.emit(fs);
    }
  }

  public chartHovered(e: any): void {
  }

}
