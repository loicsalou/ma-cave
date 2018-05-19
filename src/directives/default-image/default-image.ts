import {Directive, Input} from '@angular/core';

/**
 * Affecte une image par défaut pour l'img qui point sur une image inexistante
 */
@Directive({
             selector: '[defaultImage]', // Attribute selector
             host: {
               '(error)': 'setDefaultImage($event.target)'
             }
           })
export class DefaultImageDirective {
  @Input()
  defaultImage: string | { defaultImage: string };

  constructor() {
  }

  setDefaultImage(sourceTag: any) {
    if (typeof this.defaultImage === 'string') {
      sourceTag.src = this.defaultImage;
    } else {
      sourceTag.src = this.defaultImage[ 'defaultImage' ];
    }
  }
}
