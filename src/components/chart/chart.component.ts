import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'chart',
  templateUrl: './chart.component.html'
})
export class ChartComponent implements OnInit {

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
    this.dataset = [ {
      labels: this.labels, //apparemment pas utilisé,
      data: this.data,
      backgroundColor: this.colors,
      borderColor: 'black',
      borderWidth: 1
    } ];
    //this.options = this.getOptions();
    this.ready = true;
  }

  private getOptions(): any {
    return {
      responsive: true,
      responsiveAnimationDuration: 100,
      legend: {
        display: this.legend !== 'none',
        position: this.legend !== 'none' ? this.legend : ''
      }
    };
  }

  chartHovered( event: any ) {
    let active = event[ 'active' ];
    let element: any = active !== undefined && active.length > 0 ? active[ 0 ] : undefined;
    this.trace('hover');
  }

  chartClicked( event: any ) {
    let active = event[ 'active' ];
    let index = active !== undefined && active.length > 0 ? active[ 0 ][ '_index' ] : undefined;
    if (index !== undefined) {
      this.portionSelected.emit(this.getChartEvent(index));
    }
  }

  trace( msg: string ) {
    // console.info(msg);
  }

  private getChartEvent( index: number ): ChartEvent {
    return <ChartEvent> {
      index: index,
      value: (index < this.data.length ? this.data[ index ] : undefined),
      label: (index < this.labels.length ? this.labels[ index ] : undefined)
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
  value: any;
  label: string;
}
