import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ChartComponent} from './chart.component';
import {ChartsModule} from 'ng2-charts';
import {FormsModule} from '@angular/forms';

describe('ChartComponent', () => {
  let component: ChartComponent;
  let fixture: ComponentFixture<ChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
                                     declarations: [ ChartComponent ],
                                     imports: [ ChartsModule, FormsModule ]
                                   })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartComponent);
    component = fixture.componentInstance;
    component.labels = [ 'label' ];
    component.data = [ 10 ];
    component.legend = 'none';
    component.type = 'bar';
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
