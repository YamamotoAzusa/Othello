/**
 * ゲームの状態を表す列挙型。
 * - `NOT_STARTED`: ゲーム開始前
 * - `IN_PROGRESS`: ゲーム進行中
 * - `ENDED`: ゲーム終了
 */
export enum GameStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  ENDED = 'ENDED',
}
