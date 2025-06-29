import { Color } from '../shared/Color';

export class Player {
  constructor(public color: Color, public name: string) {}

  equals(other: Player): boolean {
    return this.color === other.color;
  }
}
