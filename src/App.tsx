/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GameConfig, GameState } from './types';
import { SetupScreen } from './components/SetupScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { GameScreen } from './components/GameScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { generateQuestions } from './services/gemini';

export default function App() {
  const [gameState, setGameState] = useState<GameState>({
    status: 'setup',
    config: null,
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    health: 3,
    consecutiveCorrect: 0,
    activeQuestion: null,
    items: {
      timeBoosts: 0,
      hints: 0,
    },
    results: [],
    bossModeActive: false,
    timeLeft: 0,
  });

  const handleStartGame = async (config: GameConfig) => {
    setGameState(s => ({ ...s, status: 'loading', config }));
    const questions = await generateQuestions(config);
    if (questions && questions.length > 0) {
      setGameState(s => ({
        ...s,
        status: 'playing',
        questions,
        currentQuestionIndex: 0,
        score: 0,
        health: 3,
        consecutiveCorrect: 0,
        results: [],
      }));
    } else {
      // If error or empty
      alert("Không thể tải cấu hình nhiệm vụ! Vui lòng thử lại.");
      setGameState(s => ({ ...s, status: 'setup' }));
    }
  };

  const handleRestart = () => {
    setGameState(s => ({
      ...s,
      status: 'setup',
      questions: [],
      score: 0,
      health: 3,
      consecutiveCorrect: 0,
      results: [],
    }));
  };

  return (
    <>
      {gameState.status === 'setup' && <SetupScreen onStart={handleStartGame} />}
      {gameState.status === 'loading' && <LoadingScreen />}
      {gameState.status === 'playing' && (
        <GameScreen gameState={gameState} setGameState={setGameState} />
      )}
      {gameState.status === 'results' && (
        <ResultsScreen gameState={gameState} onRestart={handleRestart} />
      )}
    </>
  );
}
