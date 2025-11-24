export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface BossArchetype {
  id: string;
  name: string;
  description: string;
  iconName: string; // Used to map to Lucide icons in UI
  behaviors: string[];
}

export interface RoastScores {
  impulse: number;    // 拍脑袋指数 (0-30)
  workload: number;   // 工作量膨胀指数 (0-30)
  drain: number;      // 精神内耗指数 (0-30)
  humor: number;      // 幽默加成 (0-10)
}

export interface RoastResult {
  totalScore: number;
  scores: RoastScores;
  roastContent: string; // The main punchline/roast
  analysis: string;     // The funny analysis type (e.g. "Pretending to understand")
  summaryTag: string;   // Short tag (e.g. "Cyber Niuma")
}
