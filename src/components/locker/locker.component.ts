import {EventEmitter, Input, OnChanges, Output, ViewChild} from '@angular/core';
import {Bottle} from '../../model/bottle';
import {Gesture} from '@ionic/angular';
import {LockerDimension} from '../../model/locker-dimension';
import {SimpleLocker} from '../../model/simple-locker';
import {ZoomableDirective} from '../zoomable.directive';
import {Cell} from './cell';

export abstract class LockerComponent implements OnChanges {

  @ViewChild(ZoomableDirective) zoomable: ZoomableDirective;

  @Input()
  content: Bottle[] = [];
  @Input()
  selectable: boolean = true;
  @Input()
  highlighted: Bottle[];

  @Output()
  onCellSelected: EventEmitter<Cell> = new EventEmitter<Cell>();
  @Output()
  bottlesChanged: EventEmitter<Bottle[]> = new EventEmitter<Bottle[]>();

  currentGesture: any;
  currentStyle: any;
  scale: number;

  selected: boolean = false;

  constructor() {
  }

  abstract get dimension(): LockerDimension;

  ngOnChanges(changeEvent) {
    if (changeEvent[ 'content' ] || changeEvent[ 'locker' ]) {
      this.resetComponent();
    }
  }

  /**
   * refreshes component after an update has been made
   */
  public abstract resetComponent();

  //avant d'enlever la première rangée on s'assure qu'elle est vide
  public abstract canRemoveFirstRow(rowNumber: number): boolean;

  //avant d'enlever la première colonne on s'assure qu'elle est vide
  public abstract canRemoveFirstColumn(colNumber: number): boolean;

  //avant d'enlever la dernière rangée on s'assure qu'elle est vide
  public abstract canRemoveLastRow(rowNumber: number): boolean;

  //avant d'enlever la dernière colonne on s'assure qu'elle est vide
  public abstract canRemoveLastColumn(colNumber: number): boolean;

  /**
   * affecte une nouvelle dimension au locker. Comme la dimension est immutable on en recrée une.
   * @param {SimpleLocker} locker
   * @param {number} added
   */
  protected updateX(locker: SimpleLocker, added: number) {
    locker.dimension = {x: locker.dimension.x + added, y: locker.dimension.y};
  }

  /**
   * affecte une nouvelle dimension au locker. Comme la dimension est immutable on en recrée une.
   * @param {SimpleLocker} locker
   * @param {number} added
   */
  protected updateY(locker: SimpleLocker, added: number) {
    locker.dimension = {x: locker.dimension.x, y: locker.dimension.y + added};
  }

  protected hapticConfirm() {
  }

  protected setupPinchZoom(elm: HTMLElement, initScale: number = 1): Gesture {
    const gesture = new Gesture(elm);

    // max translate x = (container_width - element absolute_width)px
    // max translate y = (container_height - element absolute_height)px
    let ow = 0;
    let oh = 0;
    for (let i = 0; i < elm.children.length; i++) {
      let c = <HTMLElement>elm.children.item(i);
      ow = c.offsetWidth;
      oh += c.offsetHeight;
    }
    const original_x = elm.clientWidth - ow;
    const original_y = elm.clientHeight - oh;
    let max_x = original_x;
    let max_y = original_y;
    let min_x = 0;
    let min_y = 0;
    let x = 0;
    let y = 0;
    let last_x = 0;
    let last_y = 0;
    this.scale = initScale;
    let base = this.scale;
    let xCenter = 0;
    let yCenter = 0;

    gesture.listen();
    gesture.on('pan', onPan);
    gesture.on('panend', onPanend);
    gesture.on('pancancel', onPanend);
    gesture.on('tap', onTap);
    gesture.on('pinch', onPinch);
    gesture.on('pinchend', onPinchend);
    gesture.on('pinchcancel', onPinchend);
    gesture.on('swipe', onPinchend);
    let self = this;

    function onPan(ev) {
      ev.preventDefault();
      x = ev.deltaX;
      y = ev.deltaY;
      setCenter(ev.srcEvent);
      setCoor(ev.deltaX, ev.deltaY);
      transform();
    }

    /**
     * centre d'action de l'utilisateur pour le pan par ex.
     * A réactiver quand j'aurai compris les calculs de redimensionnement (à dessiner pour comprendre)
     * @param {PointerEvent} ev
     */
    function setCenter(ev: PointerEvent) {
      //xCenter=ev.offsetX;
      //yCenter=ev.offsetY;
    }

    function onPanend(ev) {
      self.currentGesture = 'panend';
      ev.preventDefault();
      // remembers previous position to continue panning.
      last_x = x;
      last_y = y;
      transform(x, y);
    }

    function setScale(sc: number) {
      self.scale = sc;
      setBounds();
      transform();
    }

    function onTap(ev) {
      setCenter(ev.srcEvent);
      self.currentGesture = 'tap';
      ev.preventDefault();
      if (ev.tapCount === 2) {
        let reset = false;
        self.scale += .5;
        if (self.scale > 2) {
          self.scale = 1;
          reset = true;
        }
        setBounds();
        reset ? transform(max_x / 2, max_y / 2) : transform();
      }
    }

    function onPinch(ev) {
      setCenter(ev.srcEvent);
      self.currentGesture = 'pinch';
      ev.preventDefault();
      // formula to append scale to new scale
      self.scale = base + (ev.scale * self.scale - self.scale) / self.scale;

      setBounds();
      transform();
    }

    function onPinchend(ev) {
      setCenter(ev.srcEvent);
      self.currentGesture = 'pinchend';
      if (self.scale > 4) {
        self.scale = 4;
      }
      if (self.scale < 0.5) {
        self.scale = 0.5;
      }
      // lets pinch know where the new base will start
      base = self.scale;
      setBounds();
      transform();
    }

    function setBounds() {
      // I am scaling the container not the elements
      // since container is fixed, the container scales from the middle, while the
      // content scales down and right, with the top and left of the container as boundaries
      // scaled = absolute width * scale - already set width divided by 2;
      let scaled_x = Math.ceil((elm.offsetWidth * self.scale - elm.offsetWidth) / 2);
      let scaled_y = Math.ceil((elm.offsetHeight * self.scale - elm.offsetHeight) / 2);
      // for max_x && max_y; adds the value relevant to their overflowed size
      let overflow_x = Math.ceil(original_x * self.scale - original_x); // returns negative
      let overflow_y = Math.ceil(oh * self.scale - oh);

      max_x = original_x - scaled_x + overflow_x;
      min_x = 0 + scaled_x;
      // remove added height from container
      max_y = original_y + scaled_y - overflow_y;
      min_y = 0 + scaled_y;

      setCoor(-scaled_x, scaled_y);
    }

    function setCoor(xx: number, yy: number) {
      x = Math.min(Math.max((last_x + xx), max_x), min_x);
      y = Math.min(Math.max((last_y + yy), max_y), min_y);
    }

    // xx && yy are for resetting the position when the scale return to 1.
    function transform(xx?: number, yy?: number) {
      elm.style.webkitTransform = `translate3d(${(xx || x) + xCenter}px, ${(yy || y) + yCenter}px, 0) scale3d(${self.scale}, ${self.scale}, 1)`;
      self.currentStyle = elm.style.webkitTransform;
    }

    if (this.scale !== 1) {
      setBounds();
      transform();
    }
    ;

    return gesture;
  }
}

