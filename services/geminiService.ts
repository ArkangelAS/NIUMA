import { GoogleGenAI, Type } from "@google/genai";
import { RoastResult } from "../types";

// Get API Key exclusively from process.env.API_KEY.
// This is injected via vite.config.ts define or environment variables.
const apiKey = process.env.API_KEY;

let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

const MODEL_NAME = 'gemini-2.5-flash';

const SYSTEM_INSTRUCTION = `
你是一个名为「对牛谈马」的职场嘴替应用。
角色：一个深谙职场潜规则、幽默犀利、爱讲大实话的“老油条”观察员。
任务：根据用户选择的“领导类型”和“具体行为”，生成一份《牛马指数诊断报告》。

计算逻辑（参考）：
- 拍脑袋指数 (0-30)：决策是否草率、无逻辑。
- 工作量膨胀指数 (0-30)：给员工造成多大的无效劳动。
- 精神内耗指数 (0-30)：对情绪的折磨程度。
- 幽默加成 (0-10)：自嘲程度或荒谬程度。
总分 = 前三项之和 + 幽默加成 (上限100)。

风格要求：
1. 吐槽要辛辣但有趣，不仅吐槽领导，也要适度调侃打工人的“牛马”属性。
2. 多用职场黑话梗（如：闭环、颗粒度、赋能、抓手）。
3. 绝对不要说教，要共情。
`;

export const generateRoast = async (bossType: string, behavior: string): Promise<RoastResult> => {
  // If no API key is configured or initialized, use fallback immediately
  if (!ai) {
    console.warn("No API Key found. Using fallback data.");
    return getFallbackData(bossType);
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            totalScore: { type: Type.INTEGER, description: "Total Niuma Index score (0-100)" },
            scores: {
              type: Type.OBJECT,
              properties: {
                impulse: { type: Type.INTEGER, description: "Impulsive decision score (0-30)" },
                workload: { type: Type.INTEGER, description: "Workload inflation score (0-30)" },
                drain: { type: Type.INTEGER, description: "Mental drain score (0-30)" },
                humor: { type: Type.INTEGER, description: "Humor bonus score (0-10)" },
              },
              required: ["impulse", "workload", "drain", "humor"]
            },
            roastContent: { type: Type.STRING, description: "A witty, sarcastic roast paragraph." },
            analysis: { type: Type.STRING, description: "Short analysis of the behavior style (e.g. 'Performance Art Management')." },
            summaryTag: { type: Type.STRING, description: "A funny title for the user (e.g. 'Cyber Peasant')." }
          },
          required: ["totalScore", "scores", "roastContent", "analysis", "summaryTag"]
        }
      },
      contents: `领导类型：${bossType}。
      具体行为：${behavior}。
      请生成诊断报告。`,
    });

    const result = JSON.parse(response.text || '{}');
    return result as RoastResult;
  } catch (error) {
    console.error("Error generating roast:", error);
    return getFallbackData(bossType);
  }
};

// Fallback data generator for when API fails or is missing
const getFallbackData = (bossType: string): RoastResult => {
  return {
    totalScore: Math.floor(Math.random() * 20) + 80, // Random high score 80-99
    scores: { 
      impulse: 28, 
      workload: 25, 
      drain: 29, 
      humor: 8 
    },
    roastContent: `恭喜你，遇到了传说中的"${bossType}"完全体。这种情况建议不要试图理解，因为理解了你也就疯了。工资是精神损失费，但这笔钱显然不够看病。`,
    analysis: "无法被碳基生物理解的熵增行为",
    summaryTag: "天选纯血牛马"
  };
};