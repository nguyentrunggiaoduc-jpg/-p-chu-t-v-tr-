import React from 'react';
import { GameState } from '../types';
import { RefreshCcw, Star, Heart, CheckCircle, XCircle } from 'lucide-react';

interface ResultsScreenProps {
  gameState: GameState;
  onRestart: () => void;
}

export function ResultsScreen({ gameState, onRestart }: ResultsScreenProps) {
  const correctCount = gameState.results.filter(r => r.isCorrect).length;
  const total = gameState.config?.count || 0;
  const percentage = Math.round((correctCount / total) * 100);

  return (
    <div className="min-h-screen space-bg flex items-center justify-center p-4">
      <div className="question-overlay p-8 rounded-3xl shadow-2xl w-full max-w-4xl text-slate-100 flex flex-col max-h-[90vh]">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400 font-display mb-4">
            BÁO CÁO NHIỆM VỤ
          </h1>
          <div className="flex justify-center gap-8 text-2xl font-bold">
            <div className="flex items-center gap-2 text-yellow-400">
              <Star className="w-8 h-8 fill-current" />
              <span>{gameState.score} Điểm</span>
            </div>
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-8 h-8" />
              <span>{correctCount} / {total} Đúng</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-8 custom-scrollbar">
          {gameState.results.map((result, i) => (
            <div key={i} className={`p-4 rounded-xl border ${result.isCorrect ? 'bg-green-900/20 border-green-800' : 'bg-red-900/20 border-red-800'}`}>
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  {result.isCorrect ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-500" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-lg mb-2">Câu {i + 1}: {result.question.text}</p>
                  <div className="text-sm text-slate-300">
                    <span className="text-slate-400 font-medium">Đáp án đúng:</span> {result.question.options[result.question.correctAnswerIndex]}
                  </div>
                  {!result.isCorrect && (
                    <div className="text-sm text-slate-300 mt-1">
                      <span className="text-red-400 font-medium">Giải thích:</span> {result.question.explanation}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-slate-700/50 flex justify-center">
          <button
            onClick={onRestart}
            className="bg-sky-500 hover:bg-sky-400 text-slate-900 font-bold py-4 px-8 rounded-2xl transition-all shadow-[0_0_20px_rgba(56,189,248,0.4)] flex items-center justify-center gap-2"
          >
            <RefreshCcw className="w-5 h-5" />
            CHƠI LẠI TRẠM VŨ TRỤ
          </button>
        </div>
      </div>
    </div>
  );
}
