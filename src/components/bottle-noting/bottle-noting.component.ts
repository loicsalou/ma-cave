import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Bottle} from '../../model/bottle';
import {TranslateService} from '@ngx-translate/core';
import {Rating} from '../rating/rating';

/**
 * Generated class for the BottleNotingComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
             selector: 'bottle-noting',
             templateUrl: 'bottle-noting.component.html',
             styleUrls: [ '/bottle-noting.component.scss' ]
           })
export class BottleNotingComponent {
  @Input()
  bottle: Bottle;
  @Output()
  noted: EventEmitter<BottleNoting> = new EventEmitter();

  quality: Rating = undefined;
  maturity: Rating = undefined;
  maturityNote: number = undefined;
  pleasurePrice: Rating = undefined;
  comments: string = undefined;

  qualityLabels: string[];
  pleasurePriceLabels: string[];
  maturityLabels: string[];
  maturityTexts: string[];

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

  setGlobalQuality(note: Rating) {
    this.quality = note;
  }

  setMaturity(note: number) {
    this.maturity = {
      note: this.maturityNote,
      label: this.maturityLabels[ note ],
      text: this.maturityTexts[ note ]
    };
  }

  setPleasurePrice(note: Rating) {
    this.pleasurePrice = note;
  }

  submitRating() {
    this.setMaturity(this.maturityNote);
    this.noted.emit({
                      quality: this.quality,
                      maturity: this.maturity,
                      pleasurePrice: this.pleasurePrice,
                      comments: this.comments
                    })
  }
}

export interface BottleNoting {

  quality: Rating;
  maturity: Rating;
  pleasurePrice: Rating;
  comments: string;

}
