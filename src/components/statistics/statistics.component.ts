import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {DistributeService} from '../../service/distribute.service';
import {Bottle} from '../../model/bottle';
import * as _ from 'lodash';
import {FilterSet} from '../distribution/distribution';
import {ChartEvent} from '../chart/chart.component';
import {TranslateService} from '@ngx-translate/core';

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

  @Input()
  axis: string;
  @Input()
  legend: string = 'none';
  chartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    legend: {
      position: this.legend ? this.legend : 'none'
    }
  };
  @Input()
  topMost: number = 6;
  @Input()
  type: string = 'bar';
  @Input()
  bottles: Bottle[];
  @Output()
  filterApplied: EventEmitter<FilterSet> = new EventEmitter<FilterSet>();
  ready = false;
  totalNumberOfBottles: number = 0;

  chartLabels: string[];
  chartData: number[];
  chartType: string = 'doughnut';
  chartColors: string[] = [];

  private totalNumberOfLots: number;
  private others: KeyValue[];

  constructor(private distributionService: DistributeService,
              private translateService: TranslateService, @Inject('GLOBAL_CONFIG') private config) {
  }

  ngOnInit(): void {
    this.createChart(this.bottles.filter(btl => +btl.quantite_courante > 0));
  }

  createLabelColorChart(distribution: Distribution) {
    if (!distribution) {
      return;
    }

    //on enlève / regroupe les bouteilles représentant un pourcentage inférieur au seuil minimal d'importance
    let splitted = this.splitData(distribution, 0.005, this.topMost);
    let significantData = splitted.selected;
    this.others = splitted.others;
    //on extrait les indexes (couleur du vin par ex)
    this.chartLabels = significantData.map(kv => kv.key);
    //on affecte les couleurs des portions du chart
    this.chartColors = this.chartLabels.map(colorname => this.config.statistics.cssColorsByWineColor[ colorname ]);
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
    let splitted = this.splitData(distribution, 0.01, this.topMost);
    let significantData = splitted.selected;
    this.others = splitted.others;
    //on extrait les indexes (couleur du vin par ex)
    this.chartLabels = significantData.map(kv => kv.key);
    //on affecte les couleurs des portions du chart
    this.chartColors = this.config.statistics.standardColors;
    //les borders sont gris
    let borderColors: string[] = new Array(this.chartLabels.length);
    borderColors = _.fill(borderColors, 'grey');
    //on extrait les valeurs correspondantes (rouge, blanc par ex)
    this.chartData = significantData.map(kv => kv.value);
  }

  // events
  public chartClicked(chartEvent: ChartEvent): void {
    if (chartEvent) {
      let axis = chartEvent.axis;
      let axisValue = chartEvent.axisValue;
      let fs: FilterSet = new FilterSet();
      if (axisValue === 'autres') {
        fs[ axis ] = this.others.map(keyValue => keyValue.key);
      } else {
        fs[ axis ] = [ axisValue ];
      }

      this.filterApplied.emit(fs);
    }
  }

  public chartHovered(e: any): void {
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

  /**
   * returns a shortened filterSet so every portion of the graph is visible and significant.
   * @param distribution the Distribution object
   * @param minPercent minimum percentage below which a value becomes non significant
   * @param onlyTop number of highest values to be in the chart
   * @returns {KeyValue[]}
   */
  private splitData(distribution: Distribution, minPercent: number, onlyTop: number): TopBelow {
    let nonSignificantNumber = 0;
    if (onlyTop < 1 || minPercent > 1 || minPercent < 0) {
      throw new RangeError('onlyTop must be > 0, minPercent must be >= 0 and <=1');
    }
    //Firstly keep only values greater than minimum admitted
    let significantData = distribution.values.filter((value: KeyValue) => {
      let keep = value.value / this.totalNumberOfBottles > minPercent;
      if (!keep) {
        nonSignificantNumber += value.value;
      }
      return keep;
    });
    let nonSignificantData = distribution.values.filter((value: KeyValue) => {
      let keep = !(value.value / this.totalNumberOfBottles > minPercent);
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

    return {selected: significantData, others: nonSignificantData};
  }

}

interface TopBelow {
  selected: KeyValue[];
  others: KeyValue[];
}
