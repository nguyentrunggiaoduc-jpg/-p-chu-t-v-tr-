import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="min-h-screen space-bg flex flex-col items-center justify-center p-4">
      <Loader2 className="w-16 h-16 text-sky-500 animate-spin mb-6" />
      <h2 className="text-2xl font-bold text-white mb-2">Đang kết nối trạm vũ trụ...</h2>
      <p className="text-slate-400">AI đang chuẩn bị bộ câu hỏi cho phi hành gia.</p>
    </div>
  );
}
