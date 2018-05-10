import {ElementRef, EventEmitter, Input, OnChanges, Output, ViewChild} from '@angular/core';
import {Bottle, Position} from '../../model/bottle';
import {Gesture} from 'ionic-angular';
import {Dimension} from '../../model/locker';
import {NativeProvider} from '../../providers/native/native';
import {SimpleLocker} from '../../model/simple-locker';

export abstract class LockerComponent implements OnChanges {

  @ViewChild('zoomable') zoomable: ElementRef;

  @Input()
  content: Bottle[] = [];
  @Input()
  selectable: boolean = true;
  @Input()
  highlighted: Bottle[];

  @Output()
  onCellSelected: EventEmitter<Cell> = new EventEmitter<Cell>();
  currentGesture: any;
  currentStyle: any;
  scale: number;

  selected: boolean = false;

  constructor(private nativeProvider: NativeProvider) {
  }

  abstract get dimension(): Dimension;

  ngOnChanges(changeEvent) {
    //if (changeEvent[ 'content' ] || changeEvent[ 'locker' ]) {
    //  this.resetComponent();
    //}
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
    this.nativeProvider.feedBack();
  }

  protected setupPinchZoom(elm: HTMLElement): void {
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
    this.scale = 1;
    let base = this.scale;

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
      self.currentGesture = 'pan';
      ev.preventDefault();
      x = ev.deltaX;
      y = ev.deltaY;
      setCoor(ev.deltaX, ev.deltaY);
      transform();
    }

    function onPanend(ev) {
      self.currentGesture = 'panend';
      ev.preventDefault();
      // remembers previous position to continue panning.
      last_x = x;
      last_y = y;
      transform(x, y);
    }

    function onTap(ev) {
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
      self.currentGesture = 'pinch';
      ev.preventDefault();
      // formula to append scale to new scale
      self.scale = base + (ev.scale * self.scale - self.scale) / self.scale;

      setBounds();
      transform();
    }

    function onPinchend(ev) {
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
      elm.style.webkitTransform = `translate3d(${xx || x}px, ${yy || y}px, 0) scale3d(${self.scale}, ${self.scale}, 1)`;
      self.currentStyle = elm.style.webkitTransform;
    }
  }
}

export class Row {
  index: number;
  cells: Cell[];
  private id: string;

  constructor(cells: Cell[], rowIndex: number) {
    this.cells = cells;
    this.index = rowIndex;
  }
}

export class Cell {
  bottle: Bottle;
  cellClass: string;
  selected = false;
  position: Position;

  constructor(position: Position, private config: any) {
    this.position = position;
  }

  public isEmpty(): boolean {
    return this.bottle === undefined;
  }

  public withdraw(): Bottle {
    let btl = this.bottle;
    this.bottle = undefined;
    this.cellClass = 'empty';
    if (this.selected) {
      this.cellClass += ' selected';
    }
    return btl;
  }

  public storeBottle(bottle: Bottle, highlight = false) {
    if (!bottle) {
      return;
    }

    this.bottle = bottle;
    if (this.isEmpty()) {
      this.cellClass = 'empty';
    } else {
      this.cellClass = this.config.colorsText2Code[ bottle.label ? bottle.label.toLowerCase() : '' ];
    }
    if (highlight) {
      this.cellClass += ' highlighted';
    }
  }

  /**
   * cellule cliquée ==> remonter l'information jusqu'à la page pour qu'une éventuelle bouteille en transit soit
   * affectée à la cellule cliquée
   */
  setSelected(selected: boolean) {
    this.selected = selected;
    if (this.selected) {
      this.cellClass += ' selected';
    } else {
      this.cellClass = this.cellClass.replace('selected', '').trim();
    }
  }
}
