export class BottlePosition {
  lockerId: string;
  rack: number = 0;
  x: number;
  y: number;

  constructor(lockerId: string, x: number, y: number, rack: number = 0) {
    this.lockerId = lockerId;
    this.rack = rack;
    this.x = x;
    this.y = y;
  }

  public equals(pos: BottlePosition): boolean {
    if (!pos) {
      return false;
    }
    return (pos.lockerId === this.lockerId &&
      pos.x === this.x &&
      pos.y === this.y &&
      pos.rack === this.rack
    );
  }

  /**
   * vérifie si la position est une sous-position d'un casier.
   * @param {string} id
   */
  inLocker(id: string): boolean {
    return this.lockerId === id;
  }

  /**
   * vérifie si la position est une sous-position d'un rack.
   * @param {string} id
   * @param {number} rack peut être undefined, auquel cas la position sourant doit aussi avoir undefined comme rack
   */
  inRack(id: string, rack: number): boolean {
    return this.lockerId === id && this.rack === rack;
  }
}
