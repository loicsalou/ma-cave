import {Directive, ElementRef, Input, Renderer2} from '@angular/core';

/**
 * Generated class for the IconComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
export enum CavIcon {
  mail = 'mail', heart = 'heart', heartEmpty = 'heart-empty', star = 'star', starEmpty = 'star-empty',
  search = 'search', home = 'home', trashEmpty = 'trash-empty', zoomIn = 'zoom-in', zoomOut = 'zoom-out',
  clock = 'clock', refresh = 'refresh', downOpen = 'down-open', leftOpen = 'left-open', rightOpen = 'right-open',
  upOpen = 'up-open', apps = 'apps', mailAlt = 'mail-alt', smile = 'smile', sad = 'sad', neutral = 'neutral',
  sortAltUp = 'sort-alt-up', sortAltDown = 'sort-alt-down', history = 'history', cliders = 'sliders',
  trash = 'trash', hourglass2 = 'hourglass-2', hourglass3 = 'hourglass-3', hourglass = 'hourglass',
  facebook = 'facebook-rect', twitter = 'twitter-bird'
}

@Directive({
             selector: 'cav-icon',
             host: {
               'role': 'img'
             }
           })
export class IconComponent {

  _name: CavIcon;
  _css: string;

  constructor(private renderer: Renderer2, private elementRef: ElementRef) {
  }

  /**
   * @input {string} Specifies which icon to use. The appropriate icon will be used based on the mode.
   * For more information, see [Ionicons](/docs/ionicons/).
   */
  @Input()
  get name(): CavIcon {
    return this._name;
  }

  set name(val: CavIcon) {
    this._css = 'cav-' + val;
    this.setElementClass(this._css);
  }

  iconClass() {
    return 'cav-' + this.name;
  }

  private setElementClass(className: string) {
    this.renderer.removeClass(this.elementRef.nativeElement, className);
    this.renderer.addClass(this.elementRef.nativeElement, className);
  }

}
