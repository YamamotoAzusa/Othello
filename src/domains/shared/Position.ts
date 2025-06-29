/**
 * 盤上の位置を表すクラス。
 */
export class Position {
  /**
   * @param x X座標
   * @param y Y座標
   */
  constructor(public x: number, public y: number) {}

  /**
   * 他のPositionオブジェクトと座標が同じかどうかを判定する。
   * @param other 比較対象のPositionオブジェクト
   * @returns 座標が同じであればtrue、そうでなければfalse
   */
  equals(other: Position): boolean {
    return this.x === other.x && this.y === other.y;
  }
}
