import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Question } from '../types';
import { Heart, Star, Clock, AlertTriangle, Zap, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GameScreenProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

export function GameScreen({ gameState, setGameState }: GameScreenProps) {
  const [activeHole, setActiveHole] = useState<number | null>(null);
  const [bossActive, setBossActive] = useState<boolean>(false);
  const [meteoriteActive, setMeteoriteActive] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const totalQuestions = gameState.config?.count || 10;
  const isFinished = gameState.currentQuestionIndex >= totalQuestions || gameState.health <= 0;

  // Question Timer
  const [questionTimeLeft, setQuestionTimeLeft] = useState<number>(0);
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; selectedIndex: number } | null>(null);
  const qTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isFinished && gameState.status === 'playing') {
       if (timerRef.current) clearInterval(timerRef.current);
       setGameState(s => ({ ...s, status: 'results' }));
    }
  }, [isFinished, gameState.status, setGameState]);

  // Main Game Loop (Mole Popping)
  useEffect(() => {
    if (gameState.status !== 'playing' || gameState.activeQuestion || isFinished) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const popMole = () => {
      const isBossNext = gameState.consecutiveCorrect > 0 && gameState.consecutiveCorrect % 5 === 0;
      const isMeteorite = !isBossNext && Math.random() < 0.15; // 15% chance to spawn meteorite
      setBossActive(isBossNext);
      setMeteoriteActive(isMeteorite);
      const nextHole = Math.floor(Math.random() * 9); // 9 holes (3x3)
      setActiveHole(nextHole);
    };

    // Mole appears every 1.5s - 2.5s (could be based on difficulty)
    popMole();
    timerRef.current = setInterval(popMole, 2000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState.status, gameState.activeQuestion, isFinished, gameState.consecutiveCorrect]);

  // Handle Question Timer
  useEffect(() => {
    if (gameState.activeQuestion && !feedback) {
      setEliminatedOptions([]);
      setQuestionTimeLeft(gameState.config?.timePerQuestion || 15);
      qTimerRef.current = setInterval(() => {
        setQuestionTimeLeft(prev => {
          if (prev <= 1) {
            handleAnswer(-1); // Time's up -> wrong answer
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (!gameState.activeQuestion) {
      if (qTimerRef.current) clearInterval(qTimerRef.current);
    }

    return () => {
      if (qTimerRef.current) clearInterval(qTimerRef.current);
    };
  }, [gameState.activeQuestion]);

  const handleMoleClick = () => {
    if (gameState.activeQuestion) return;
    
    if (meteoriteActive) {
      setGameState(s => ({
        ...s,
        items: {
          ...s.items,
          hints: s.items.hints + 1,
        }
      }));
      setActiveHole(null);
      setMeteoriteActive(false);
      return;
    }

    // Pick the next question from the array
    const q = gameState.questions[gameState.currentQuestionIndex];
    if (q) {
      setGameState(s => ({ ...s, activeQuestion: q }));
      // We keep activeHole so we know which one was clicked to show explosion later
    }
  };

  const useHint = () => {
    if (gameState.items.hints > 0 && gameState.activeQuestion) {
      setGameState(s => ({ ...s, items: { ...s.items, hints: s.items.hints - 1 } }));
      
      const correctIndex = gameState.activeQuestion.correctAnswerIndex;
      const wrongIndices = [0, 1, 2, 3].filter(i => i !== correctIndex);
      // Remove two random wrong answers
      wrongIndices.sort(() => Math.random() - 0.5);
      setEliminatedOptions([wrongIndices[0], wrongIndices[1]]);
    }
  };

  const handleAnswer = (optionIndex: number) => {
    if (!gameState.activeQuestion || feedback) return;
    if (qTimerRef.current) clearInterval(qTimerRef.current);

    const isCorrect = optionIndex === gameState.activeQuestion.correctAnswerIndex;
    const isBoss = bossActive;

    const timeTaken = (gameState.config?.timePerQuestion || 15) - questionTimeLeft;

    setFeedback({ isCorrect, selectedIndex: optionIndex });

    setTimeout(() => {
      setGameState(s => {
        const points = isCorrect ? (isBoss ? 200 : 100) : 0;
        const streak = isCorrect ? s.consecutiveCorrect + 1 : 0;
        const newHealth = isCorrect ? s.health : s.health - 1;

        return {
          ...s,
          score: s.score + points,
          health: newHealth,
          consecutiveCorrect: streak,
          results: [
            ...s.results,
            {
              question: s.activeQuestion!,
              isCorrect,
              timeTaken,
            }
          ],
          currentQuestionIndex: s.currentQuestionIndex + 1,
          activeQuestion: null,
        };
      });

      // Reset hole
      setActiveHole(null);
      setBossActive(false);
      setFeedback(null);
    }, 2000);
  };

  return (
    <div className="min-h-screen space-bg overflow-hidden relative font-sans text-slate-100 flex flex-col">
      {/* Background stars (simulated) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute w-1 h-1 bg-white rounded-full opacity-60 top-20 left-40"></div>
        <div className="absolute w-2 h-2 bg-white rounded-full opacity-60 top-60 left-20"></div>
        <div className="absolute w-1 h-1 bg-white rounded-full opacity-60 top-40 right-80"></div>
        <div className="absolute w-1.5 h-1.5 bg-white rounded-full opacity-60 bottom-40 right-20"></div>
        <div className="absolute w-1 h-1 bg-white rounded-full opacity-60 top-10 right-1/4"></div>
      </div>
      
      {/* HUD Header */}
      <div className="relative z-10 h-20 w-full flex items-center justify-between px-4 md:px-8 bg-slate-900/50 border-b border-slate-800 pointer-events-none">
        <div className="flex items-center gap-4 md:gap-6">
            <div className="flex items-center gap-1 md:gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <motion.div key={i} initial={false} animate={{ scale: i < gameState.health ? 1 : 0.8, opacity: i < gameState.health ? 1 : 0.3 }}>
                      <Heart className="w-5 h-5 md:w-6 md:h-6 text-rose-500 fill-rose-500 drop-shadow-md" />
                  </motion.div>
                ))}
            </div>
            <div className="h-8 md:h-10 w-px bg-slate-700"></div>
            <div className="flex flex-col items-start hidden sm:flex">
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Cấp độ</span>
                <span className="text-sky-400 font-bold text-xs md:text-sm">{gameState.config?.grade}: {gameState.config?.subject}</span>
            </div>
        </div>

        <div className="flex flex-col items-center">
             <div className="text-indigo-300 font-semibold text-xs md:text-sm mb-1 uppercase tracking-wider">Tiến độ: {gameState.currentQuestionIndex} / {totalQuestions}</div>
             {gameState.consecutiveCorrect >= 3 && (
               <motion.div 
                 initial={{ opacity: 0 }} 
                 animate={{ opacity: 1 }}
                 className="text-orange-400 font-bold text-xs flex items-center gap-1"
               >
                 <Zap className="w-3 h-3" /> Streak: {gameState.consecutiveCorrect}
               </motion.div>
             )}
        </div>

        <div className="flex items-center gap-4 md:gap-6 text-right">
            <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Điểm số</span>
                <span className="text-amber-400 font-bold text-lg md:text-xl">{gameState.score} ⭐</span>
            </div>
            {gameState.items.hints > 0 && (
               <div className="flex flex-col items-center">
                  <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold flex items-center gap-1">🪨 <span className="text-blue-400 text-sm">{gameState.items.hints}</span></span>
               </div>
            )}
        </div>
      </div>

      <div className="flex-1 relative flex items-center justify-center p-4">
        <div className="grid grid-cols-3 gap-y-16 gap-x-8 md:gap-x-24 max-w-4xl w-full">
          {Array.from({ length: 9 }).map((_, i) => {
            const isActive = activeHole === i;
            return (
              <div key={i} className="relative flex justify-center items-end h-24 sm:h-32">
                {/* Hole */}
                <div className="crater w-24 sm:w-40 h-10 sm:h-16 rounded-[100%] absolute bottom-0 z-0"></div>
                {/* Mole container (clips the mole so it comes out of the hole) */}
                <div className="absolute inset-x-0 bottom-5 sm:bottom-8 top-0 overflow-hidden z-10 flex justify-center">
                  <AnimatePresence>
                    {isActive && !gameState.activeQuestion && (
                      <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: "0%" }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        onClick={handleMoleClick}
                        className="cursor-pointer pointer-events-auto flex items-end justify-center"
                      >
                        {bossActive ? (
                          <div className="text-[5rem] sm:text-[6rem] drop-shadow-[0_0_15px_rgba(255,0,0,0.5)]">👾</div>
                        ) : meteoriteActive ? (
                          <div className="text-[4rem] sm:text-[5rem] drop-shadow-md">🪨</div>
                        ) : (
                          <div className="text-[4rem] sm:text-[5rem] drop-shadow-md">🐹</div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Question Modal Overlay */}
      <AnimatePresence>
        {gameState.activeQuestion && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="question-overlay w-full max-w-[600px] rounded-3xl p-6 sm:p-10 shadow-2xl"
            >
              <div className="text-center mb-8">
                <div className="flex justify-between items-center mb-6">
                  <span className="px-3 py-1 bg-sky-500/20 text-sky-400 text-xs font-bold rounded-full border border-sky-500/30 uppercase tracking-tighter">
                    Câu hỏi {gameState.currentQuestionIndex + 1}/{totalQuestions}
                  </span>
                  {bossActive && (
                    <span className="px-3 py-1 bg-rose-500/20 text-rose-400 text-xs font-bold rounded-full border border-rose-500/30 uppercase tracking-tighter flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3" /> BOSS BATTLE
                    </span>
                  )}
                  <span className={`px-3 py-1 flex items-center gap-1 font-bold text-sm ${questionTimeLeft <= 5 ? 'text-rose-500 animate-pulse' : 'text-slate-300'}`}>
                    <Clock className="w-4 h-4" /> {questionTimeLeft}s
                  </span>
                </div>

                {feedback ? (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`py-4 rounded-2xl mb-4 ${feedback.isCorrect ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-rose-500/20 text-rose-400 border border-rose-500/50'}`}
                  >
                    <h2 className="text-2xl font-black uppercase tracking-wider">
                      {feedback.isCorrect ? 'Chính xác! 🌟' : feedback.selectedIndex === -1 ? 'Hết giờ! ⏱️' : 'Sai rồi! 💔'}
                    </h2>
                    {!feedback.isCorrect && (
                      <p className="mt-2 text-sm sm:text-base text-slate-300 px-4">
                        {gameState.activeQuestion.explanation}
                      </p>
                    )}
                  </motion.div>
                ) : (
                  <h2 className="text-xl sm:text-2xl font-bold mt-4 text-white leading-tight">
                    {gameState.activeQuestion.text}
                  </h2>
                )}
              </div>

                <div className="flex justify-center mb-6">
                  {gameState.items.hints > 0 && eliminatedOptions.length === 0 && !feedback && (
                    <button onClick={useHint} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-2 transition-colors">
                      <span>🪨</span> Dùng thiên thạch loại bỏ 2 đáp án sai
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {gameState.activeQuestion.options.map((opt, idx) => {
                    const isEliminated = eliminatedOptions.includes(idx);
                    let btnClass = isEliminated ? 'opacity-20 cursor-not-allowed bg-transparent border-slate-700/50' : 'bg-white/5 border-white/10 hover:bg-white/10';
                    let iconClass = isEliminated ? 'bg-slate-700/50 text-slate-500' : 'bg-slate-700/50 text-slate-300';
                    
                    if (feedback) {
                      const isCorrectOption = idx === gameState.activeQuestion!.correctAnswerIndex;
                      const isSelected = feedback.selectedIndex === idx;
                      
                      if (isCorrectOption) {
                          btnClass = 'bg-green-500/20 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)] pointer-events-none transform scale-[1.02]';
                          iconClass = 'bg-green-500 text-white';
                      } else if (isSelected && !feedback.isCorrect) {
                          btnClass = 'bg-rose-500/20 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)] pointer-events-none';
                          iconClass = 'bg-rose-500 text-white';
                      } else {
                          btnClass = 'opacity-40 bg-transparent border-white/5 pointer-events-none';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => !isEliminated && handleAnswer(idx)}
                        disabled={isEliminated || feedback !== null}
                        className={`answer-btn py-4 px-4 sm:px-6 rounded-2xl text-left text-white font-semibold flex items-center gap-3 sm:gap-4 transition-all border ${btnClass}`}
                      >
                        <span className={`w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0 transition-colors ${iconClass}`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="mt-0.5 text-sm sm:text-base">{opt}</span>
                      </button>
                    )
                  })}
                </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
