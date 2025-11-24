import { GoogleGenAI, Type } from "@google/genai";
import { RoastResult } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

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
    // Fallback data
    return {
      totalScore: 99,
      scores: { impulse: 30, workload: 30, drain: 29, humor: 10 },
      roastContent: "服务器也被你的老板整崩溃了，这种级别的离谱，建议直接申请吉尼斯世界纪录。",
      analysis: "连AI都无法计算的混沌熵增",
      summaryTag: "天选打工人"
    };
  }
};
