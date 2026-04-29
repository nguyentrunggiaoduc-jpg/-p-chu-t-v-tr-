export interface GameConfig {
  grade: string;
  subject: string;
  count: number;
  difficulty: string;
  timePerQuestion: number;
  topic: string;
  isTeamMode: boolean;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface GameState {
  status: 'setup' | 'loading' | 'playing' | 'results';
  config: GameConfig | null;
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  health: number;
  consecutiveCorrect: number;
  activeQuestion: Question | null;
  items: {
    timeBoosts: number;
    hints: number;
  };
  results: {
    question: Question;
    isCorrect: boolean;
    timeTaken: number;
  }[];
  bossModeActive: boolean;
  timeLeft: number; // overall or per question? per question
}
