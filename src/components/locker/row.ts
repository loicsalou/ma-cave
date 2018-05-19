import {Cell} from './cell';

export class Row {
  index: number;
  cells: Cell[];
  private id: string;

  constructor(cells: Cell[], rowIndex: number) {
    this.cells = cells;
    this.index = rowIndex;
  }
}
