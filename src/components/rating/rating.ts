import {Component, EventEmitter, Input, Output} from '@angular/core';

/**
 * Generated class for the RatingComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
             selector: 'rating',
             templateUrl: 'rating.html'
           })
export class RatingComponent {
  @Input()
  labels: string[];
  @Input()
  title: string;
  @Output()
  rated: EventEmitter<Rating> = new EventEmitter();

  note: number = undefined;

  constructor() {
  }

  rate(note: number) {
    this.note = note;
    this.rated.emit({
                      note: note,
                      label: this.labels[ note ]
                    });
  }
}

export interface Rating {
  note: number;
  label: string;
  text?: string;
}
