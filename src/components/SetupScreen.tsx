import React, { useState } from 'react';
import { GameConfig } from '../types';
import { Rocket } from 'lucide-react';

interface SetupScreenProps {
  onStart: (config: GameConfig) => void;
}

export function SetupScreen({ onStart }: SetupScreenProps) {
  const [config, setConfig] = useState<GameConfig>({
    grade: 'Lớp 6',
    subject: 'Toán',
    count: 10,
    difficulty: 'Trung bình',
    timePerQuestion: 15,
    topic: '',
    isTeamMode: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart(config);
  };

  return (
    <div className="min-h-screen space-bg flex items-center justify-center p-4">
      <div className="question-overlay p-8 rounded-3xl shadow-2xl w-full max-w-2xl text-slate-100">
        <div className="flex items-center gap-4 mb-8 justify-center">
          <div className="p-3 bg-indigo-500 rounded-full">
            <Rocket className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400 font-display text-center">
            ĐẬP CHUỘT VŨ TRỤ
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">Khối lớp</label>
              <select
                value={config.grade}
                onChange={e => setConfig({ ...config, grade: e.target.value })}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
              >
                {Array.from({ length: 12 }, (_, i) => `Lớp ${i + 1}`).map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">Môn học</label>
              <select
                value={config.subject}
                onChange={e => setConfig({ ...config, subject: e.target.value })}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
              >
                {['Toán', 'Văn', 'Anh', 'Lý', 'Hóa', 'Sinh', 'Sử', 'Địa', 'GDCD'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">Số lượng câu hỏi</label>
              <select
                value={config.count}
                onChange={e => setConfig({ ...config, count: Number(e.target.value) })}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
              >
                <option value={10}>10 câu</option>
                <option value={20}>20 câu</option>
                <option value={30}>30 câu</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">Độ khó</label>
              <select
                value={config.difficulty}
                onChange={e => setConfig({ ...config, difficulty: e.target.value })}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
              >
                <option value="Dễ">Dễ</option>
                <option value="Trung bình">Trung bình</option>
                <option value="Khó">Khó</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">Thời gian mỗi lượt (giây)</label>
              <select
                value={config.timePerQuestion}
                onChange={e => setConfig({ ...config, timePerQuestion: Number(e.target.value) })}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
              >
                <option value={15}>15s</option>
                <option value={30}>30s</option>
                <option value={60}>60s</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">Chủ đề bài học (Không bắt buộc)</label>
              <input
                type="text"
                value={config.topic}
                onChange={e => setConfig({ ...config, topic: e.target.value })}
                placeholder="Ví dụ: Phân số, Lực ma sát..."
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-8 bg-sky-500 hover:bg-sky-400 text-slate-900 font-bold py-4 px-8 rounded-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(56,189,248,0.4)] flex items-center justify-center gap-2"
          >
            <Rocket className="w-6 h-6" />
            KHỞI ĐỘNG TRẠM VŨ TRỤ
          </button>
        </form>
      </div>
    </div>
  );
}
