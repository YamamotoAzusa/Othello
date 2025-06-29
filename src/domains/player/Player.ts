import { Color } from '../shared/Color';

/**
 * プレイヤーを表すクラス。
 */
export class Player {
  /**
   * @param color プレイヤーの色 (黒または白)
   * @param name プレイヤーの名前
   */
  constructor(public color: Color, public name: string) {}

  /**
   * 他のPlayerオブジェクトと色が同じかどうかを判定する。
   * @param other 比較対象のPlayerオブジェクト
   * @returns 色が同じであればtrue、そうでなければfalse
   */
  equals(other: Player): boolean {
    return this.color === other.color;
  }
}
