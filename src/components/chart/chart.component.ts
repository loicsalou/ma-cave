import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
             selector: 'chart',
             templateUrl: './chart.component.html',
             changeDetection: ChangeDetectionStrategy.Default
           })
export class ChartComponent implements OnInit {

  private static LEGEND_POSITIONS = [ 'none', 'top', 'right', 'bottom', 'left' ];

  @Input()
  axis: string;

  @Input()
  labels: string[];

  @Input()
  data: any[];
  dataset: any;

  @Input()
  chartClass: string;

  @Input()
  colors: string[];

  @Input()
  legend: string;

  @Input()
  type: string | ChartType;
  public options: any;

  @Output()
  error: EventEmitter<Error>;

  @Output()
  portionSelected: EventEmitter<ChartEvent>;

  ready = false;

  constructor() {
    this.portionSelected = new EventEmitter();
  }

  ngOnInit(): void {
    if (this.legend) {
      if (ChartComponent.LEGEND_POSITIONS.indexOf(this.legend) < 0) {
        this.legend = 'top';
      }
    }
    this.dataset = [ {
      labels: this.labels, //apparemment pas utilisé,
      data: this.data,
      backgroundColor: this.colors,
      borderColor: 'black',
      borderWidth: 1
    } ];
    this.options = this.getOptions();
    this.ready = true;
  }

  chartHovered(event: any) {
  }

  chartClicked(event: any) {
    let active = event[ 'active' ];
    let index = active !== undefined && active.length > 0 ? active[ 0 ][ '_index' ] : undefined;
    if (index !== undefined) {
      this.portionSelected.emit(this.getChartEvent(index));
    }
  }

  private getOptions(): any {
    return {
      responsive: true,
      responsiveAnimationDuration: 100,

      legend: {
        display: this.legend !== undefined,
        position: this.legend !== undefined ? this.legend : 'top'
      },
      scaleShowValues: true,
      scales: {
        yAxes: [ {
          ticks: {
            beginAtZero: true
          }
        } ],
        xAxes: [ {
          ticks: {
            autoSkip: false
          }
        } ]
      }

    };
    //options: {
    //  scaleShowValues: true,
    //    scales: {
    //    yAxes: [{
    //      ticks: {
    //        beginAtZero: true
    //      }
    //    }],
    //      xAxes: [{
    //      ticks: {
    //        autoSkip: false
    //      }
    //    }]
    //  }
    //}
  }

  private getChartEvent(index: number): ChartEvent {
    return <ChartEvent> {
      index: index,
      axis: this.axis,
      value: (index < this.data.length ? this.data[ index ] : undefined),
      axisValue: (index < this.labels.length ? this.labels[ index ] : undefined)
    };
  }
}

export enum ChartType {
  area,
  bar,
  bubble,
  doughnut,
  line,
  mixed,
  pie,
  radar,
  scatter
}

export interface ChartEvent {
  index: number;
  axis: string;
  value: any;
  axisValue: string;
}
