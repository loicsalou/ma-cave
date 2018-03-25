import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Bottle} from '../../model/bottle';
import {TranslateService} from '@ngx-translate/core';
import {Rating} from '../rating/rating';
import {NgForm} from '@angular/forms';

/**
 * Generated class for the BottleNotingComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
             selector: 'bottle-noting',
             templateUrl: 'bottle-noting.component.html',
             styleUrls: [ '/bottle-noting.component.scss' ],
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class BottleNotingComponent {
  @Input()
  bottle: Bottle;
  @Output()
  noted: EventEmitter<BottleNoting> = new EventEmitter();

  quality: Rating = undefined;
  maturity: Rating = undefined;
  pleasurePrice: Rating = undefined;
  comments: string = undefined;

  qualityLabels: string[];
  pleasurePriceLabels: string[];
  maturityLabels: string[];
  maturityTexts: string[];

  @ViewChild('notingForm') notingForm: NgForm;

  constructor(private translateService: TranslateService) {
    this.translateService.get('ratings.quality').subscribe(
      labels => this.qualityLabels = labels
    );
    this.translateService.get('ratings.pleasure-price').subscribe(
      labels => this.pleasurePriceLabels = labels
    );
    this.translateService.get('ratings.maturity').subscribe(
      labels => this.maturityLabels = labels
    );
    this.translateService.get('ratings.maturity-texts').subscribe(
      labels => this.maturityTexts = labels
    );
  }

  set maturityNote(note: number) {
    this.maturity = {
      note: note,
      noteMax: this.maturityTexts.length,
      label: this.maturityLabels[ note ],
      text: this.maturityTexts[ note ]
    };
  }

  setGlobalQuality(note: Rating) {
    this.quality = note;
  }

  setPleasurePrice(note: Rating) {
    this.pleasurePrice = note;
  }

  cancelRating() {
    this.noted.emit(undefined);
  }

  submitRating() {
    if (this.isFormValid()) {
      this.noted.emit({
                        quality: this.quality,
                        maturity: this.maturity,
                        pleasurePrice: this.pleasurePrice,
                        comments: this.comments
                      });
    }
  }

  isFormValid(): boolean {
    if (this.comments === undefined) {
      this.comments = '';
    }
    if (!this.pleasurePrice) {
      return false;
    }
    if (!this.maturity) {
      return false;
    }
    if (!this.quality) {
      return false;
    }
    return true;
  }

}

export interface BottleNoting {

  quality: Rating;
  maturity: Rating;
  pleasurePrice: Rating;
  comments: string;

}
