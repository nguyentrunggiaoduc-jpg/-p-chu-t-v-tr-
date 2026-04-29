import { GoogleGenAI, Type } from "@google/genai";
import { GameConfig, Question } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateQuestions(config: GameConfig): Promise<Question[]> {
  const prompt = `Bạn là một chuyên gia thiết kế câu hỏi trắc nghiệm giáo dục.
Hãy tạo ${config.count} câu hỏi trắc nghiệm lớp ${config.grade}, môn ${config.subject}.
Chủ đề bài học: ${config.topic || "Tổng hợp kiến thức phù hợp với khối lớp và môn học đã chọn"}.
Độ khó: ${config.difficulty}.

Yêu cầu:
- Mỗi câu hỏi phải có nội dung chính xác, khoa học và đúng chương trình giáo dục.
- Có 4 đáp án (A, B, C, D) cho mỗi câu hỏi.
- Chỉ định đúng 1 đáp án chính xác qua correctAnswerIndex (0, 1, 2, 3 tương ứng A, B, C, D).
- Không lặp lại câu hỏi.
- Cung cấp giải thích ngắn gọn tại sao đáp án đó là đúng.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING, description: "Unique identifier for the question" },
            text: { type: Type.STRING, description: "The content of the question" },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Four options (A, B, C, D)",
            },
            correctAnswerIndex: {
              type: Type.INTEGER,
              description: "Index of the correct answer (0 to 3)",
            },
            explanation: {
              type: Type.STRING,
              description: "Short explanation of the correct answer",
            },
          },
          required: ["id", "text", "options", "correctAnswerIndex", "explanation"],
        },
      },
    },
  });

  const jsonStr = response.text || "[]";
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Failed to parse questions", e);
    return [];
  }
}
