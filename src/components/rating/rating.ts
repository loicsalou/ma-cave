import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

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
export class RatingComponent implements OnInit {
  @Input()
  rating: Rating;
  @Input()
  labels: string[];
  @Input()
  title: string;
  @Output()
  rated: EventEmitter<Rating> = new EventEmitter();

  note: number;

  noteArray: string[];

  constructor() {
  }

  ngOnInit() {
    if (this.rating) {
      this.noteArray = new Array<string>(this.rating.noteMax);
      this.note = this.rating.note;
    }
  }

  rate(note: number) {
    this.note = note;
    this.rated.emit({
                      note: note,
                      noteMax: this.labels.length,
                      label: this.labels[ note ]
                    });
  }
}

export interface Rating {
  note: number;
  noteMax: number;
  label: string;
  text?: string;
}
