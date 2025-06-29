'use client';

import React, { useState, useEffect } from 'react';
import { Game } from '../domains/game/Game';
import { Player } from '../domains/player/Player';
import { Color } from '../domains/shared/Color';
import { Position } from '../domains/shared/Position';
import { GameStatus } from '../domains/game/GameStatus';
import BoardComponent from './components/BoardComponent';
import GameInfoComponent from './components/GameInfoComponent';
import ResetButton from './components/ResetButton';

export default function Home() {
  // ゲームの状態を管理するstate
  const [game, setGame] = useState<Game | null>(null);
  // 黒プレイヤーの状態を管理するstate
  const [blackPlayer, setBlackPlayer] = useState<Player | null>(null);
  // 白プレイヤーの状態を管理するstate
  const [whitePlayer, setWhitePlayer] = useState<Player | null>(null);
  // 有効な手の状態を管理するstate
  const [validMoves, setValidMoves] = useState<Position[]>([]);

  // コンポーネントのマウント時にゲームを初期化する
  useEffect(() => {
    initializeGame();
  }, []);

  // ゲームを初期化する関数
  const initializeGame = () => {
    // 新しいプレイヤーを作成
    const newBlackPlayer = new Player(Color.BLACK, 'Black');
    const newWhitePlayer = new Player(Color.WHITE, 'White');
    // 新しいゲームインスタンスを作成
    const newGame = new Game(newBlackPlayer, newWhitePlayer);
    // ゲームを開始
    newGame.start();
    // プレイヤーとゲームの状態を更新
    setBlackPlayer(newBlackPlayer);
    setWhitePlayer(newWhitePlayer);
    setGame(newGame);
    // 現在のプレイヤーの有効な手を計算して設定
    setValidMoves(newGame.board.getValidMoves(newGame.currentPlayer.color));
  };

  // セルがクリックされたときのハンドラ
  const handleCellClick = (position: Position) => {
    // ゲームが進行中でない場合は何もしない
    if (!game || game.status !== GameStatus.IN_PROGRESS) return;

    try {
      // 石を置く
      game.placeStone(position);
      // gameオブジェクトのプロトタイプを維持したまま新しいオブジェクトを作成し、stateを更新して再レンダリングをトリガーする
      // これにより、クラスのメソッドが失われるのを防ぐ
      setGame(Object.assign(Object.create(Object.getPrototypeOf(game)), game));
      // 有効な手を更新
      updateValidMoves();
    } catch (error: any) {
      // エラーが発生した場合はアラートを表示
      alert(error.message);
    }
  };

  // 有効な手を更新する関数
  const updateValidMoves = () => {
    if (game && game.status === GameStatus.IN_PROGRESS) {
      // 現在のプレイヤーの有効な手を取得
      const moves = game.board.getValidMoves(game.currentPlayer.color);
      if (moves.length === 0) {
        // 有効な手がない場合は、ターンをパスする
        try {
          game.passTurn();
          // gameオブジェクトのプロトタイプを維持したまま新しいオブジェクトを作成し、stateを更新して再レンダリングをトリガーする
          setGame(Object.assign(Object.create(Object.getPrototypeOf(game)), game));
          // 次のプレイヤーの有効な手を取得
          const nextMoves = game.board.getValidMoves(game.currentPlayer.color);
          if (nextMoves.length === 0 && game.status === GameStatus.IN_PROGRESS) {
            // ターンをパスしても有効な手がない場合は、ゲームを終了するために再度ターンをパスする
            game.passTurn();
            // gameオブジェクトのプロトタイプを維持したまま新しいオブジェクトを作成し、stateを更新して再レンダリングをトリガーする
            setGame(Object.assign(Object.create(Object.getPrototypeOf(game)), game));
          }
          // 有効な手を更新
          setValidMoves(game.board.getValidMoves(game.currentPlayer.color));
        } catch (error: any) {
          // エラーが発生した場合はアラートを表示
          alert(error.message);
        }
      } else {
        // 有効な手がある場合は、stateを更新
        setValidMoves(moves);
      }
    } else {
      // ゲームが進行中でない場合は、有効な手を空にする
      setValidMoves([]);
    }
  };

  // ゲームをリセットするハンドラ
  const handleResetGame = () => {
    initializeGame();
  };

  // ゲームがロード中の場合は、ローディングメッセージを表示
  if (!game || !blackPlayer || !whitePlayer) {
    return <div>Loading game...</div>;
  }

  // ゲームのUIをレンダリング
  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f0f0f0' }}>
      <h1>Othello Game</h1>
      <GameInfoComponent
        currentPlayer={game.currentPlayer}
        status={game.status}
        winner={game.status === GameStatus.ENDED ? game.getWinner() : null}
      />
      <BoardComponent
        board={game.board}
        onCellClick={handleCellClick}
        validMoves={validMoves}
      />
      <ResetButton onReset={handleResetGame} />
    </main>
  );
}