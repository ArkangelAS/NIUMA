import React, { useState } from 'react';
import { 
  Briefcase, 
  Megaphone, 
  Zap, 
  PieChart, 
  Clock, 
  Ghost, 
  Coffee, 
  ChevronRight, 
  RefreshCw, 
  Share2, 
  AlertTriangle,
  BrainCircuit,
  TrendingUp,
  BatteryWarning,
  Award
} from 'lucide-react';
import { generateRoast } from './services/geminiService';
import { BossArchetype, RoastResult, LoadingState } from './types';

// --- Static Data Configuration ---
const BOSS_TYPES: BossArchetype[] = [
  {
    id: 'visionary',
    name: '画饼艺术家',
    description: '不靠谱的奇思妙想型',
    iconName: 'PieChart',
    behaviors: [
      '突然想做一个宇宙级新项目，对标ChatGPT',
      '明年我们要在纳斯达克敲钟',
      '不要在乎工资，眼光要长远，看期权',
      '这个需求很简单，今晚加个班就能出原型'
    ]
  },
  {
    id: 'micromanager',
    name: '显微镜成精',
    description: '像素级管理大师',
    iconName: 'Search',
    behaviors: [
      '日报必须精确到每15分钟在干什么',
      '为什么你微信回复晚了3分钟？',
      'PPT这里的蓝色好像不够“互联网”',
      '下班前开个会，复盘一下今天的摸鱼时间'
    ]
  },
  {
    id: 'speaker',
    name: '废话文学家',
    description: '开会说半天等于没说',
    iconName: 'Megaphone',
    behaviors: [
      '我们要找到抓手，形成闭环，赋能行业',
      '听懂掌声（此处省略一小时讲话）',
      '这个事情的底层逻辑是什么？',
      '既要...又要...还要...哪怕...'
    ]
  },
  {
    id: 'shifter',
    name: '太极宗师',
    description: '甩锅速度快过光速',
    iconName: 'Ghost',
    behaviors: [
      '我当时不是这个意思，你误解了',
      '这块是谁负责的？年轻人要多担当',
      '虽然我决策错了，但执行也有问题',
      '有功劳我领，有黑锅你背'
    ]
  },
  {
    id: 'grinder',
    name: '996福报怪',
    description: '不睡觉的永动机',
    iconName: 'Clock',
    behaviors: [
      '大家都不走吗？那再开个会吧',
      '周六也是正常工作日，要有狼性',
      '半夜两点在群里@所有人',
      '年轻人不要总想着休息，以后有的是时间睡'
    ]
  }
];

// --- Icon Mapping Component ---
const BossIcon = ({ name, className }: { name: string; className?: string }) => {
  switch (name) {
    case 'PieChart': return <PieChart className={className} />;
    case 'Search': return <BrainCircuit className={className} />; // Using Brain for complexity
    case 'Megaphone': return <Megaphone className={className} />;
    case 'Ghost': return <Ghost className={className} />;
    case 'Clock': return <Clock className={className} />;
    default: return <Briefcase className={className} />;
  }
};

const App: React.FC = () => {
  const [step, setStep] = useState<'HOME' | 'SELECT_TYPE' | 'SELECT_BEHAVIOR' | 'RESULT'>('HOME');
  const [selectedBoss, setSelectedBoss] = useState<BossArchetype | null>(null);
  const [selectedBehavior, setSelectedBehavior] = useState<string>('');
  const [result, setResult] = useState<RoastResult | null>(null);
  const [loading, setLoading] = useState<LoadingState>(LoadingState.IDLE);

  // --- Actions ---
  const handleStart = () => setStep('SELECT_TYPE');

  const handleSelectType = (boss: BossArchetype) => {
    setSelectedBoss(boss);
    setStep('SELECT_BEHAVIOR');
  };

  const handleSelectBehavior = async (behavior: string) => {
    setSelectedBehavior(behavior);
    setLoading(LoadingState.LOADING);
    setStep('RESULT');

    if (selectedBoss) {
      try {
        const roastData = await generateRoast(selectedBoss.name, behavior);
        setResult(roastData);
        setLoading(LoadingState.SUCCESS);
      } catch (e) {
        setLoading(LoadingState.ERROR);
      }
    }
  };

  const handleRestart = () => {
    setStep('HOME');
    setSelectedBoss(null);
    setSelectedBehavior('');
    setResult(null);
    setLoading(LoadingState.IDLE);
  };

  // --- Views ---

  // 1. Home View
  if (step === 'HOME') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-10"></div>
        
        <div className="z-10 text-center max-w-md w-full">
          <div className="mb-6 flex justify-center">
            <div className="bg-yellow-400 p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black transform rotate-[-3deg]">
              <Zap size={48} className="text-black" />
            </div>
          </div>
          
          <h1 className="text-5xl font-black text-slate-900 mb-2 tracking-tight">
            对牛谈马
          </h1>
          <p className="text-xl text-slate-600 font-medium mb-8">
            职场 <span className="text-yellow-600 font-bold bg-yellow-100 px-1 rounded">牛马指数</span> 权威检测中心
          </p>

          <div className="bg-white border-2 border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] mb-8 text-left space-y-3">
            <div className="flex items-center text-slate-700">
              <AlertTriangle className="mr-3 text-red-500 shrink-0" size={20} />
              <span>不仅要干活，还要背锅？</span>
            </div>
            <div className="flex items-center text-slate-700">
              <BatteryWarning className="mr-3 text-orange-500 shrink-0" size={20} />
              <span>领导一句话，甚至不用动脑？</span>
            </div>
            <div className="flex items-center text-slate-700">
              <Coffee className="mr-3 text-blue-500 shrink-0" size={20} />
              <span>来测测你离“爆发”还有多远。</span>
            </div>
          </div>

          <button 
            onClick={handleStart}
            className="w-full bg-slate-900 text-white text-xl font-bold py-4 rounded-xl shadow-[4px_4px_0px_0px_#facc15] active:translate-y-1 active:shadow-none transition-all hover:bg-slate-800"
          >
            开始诊断
          </button>
          
          <p className="mt-4 text-xs text-slate-400">
            *本应用纯属娱乐，请勿发送给老板（除非你不想干了）
          </p>
        </div>
      </div>
    );
  }

  // 2. Select Boss Type
  if (step === 'SELECT_TYPE') {
    return (
      <div className="min-h-screen bg-slate-100 p-6">
        <header className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">选择你的领导类型</h2>
          <span className="text-sm font-bold bg-slate-200 px-3 py-1 rounded-full">1/2</span>
        </header>

        <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
          {BOSS_TYPES.map((boss) => (
            <button
              key={boss.id}
              onClick={() => handleSelectType(boss)}
              className="bg-white p-5 rounded-xl border-2 border-transparent hover:border-black shadow-sm hover:shadow-md transition-all text-left flex items-center group"
            >
              <div className="bg-blue-50 p-3 rounded-lg mr-4 group-hover:bg-yellow-100 transition-colors">
                <BossIcon name={boss.iconName} className="text-slate-700" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-slate-900">{boss.name}</h3>
                <p className="text-sm text-slate-500">{boss.description}</p>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-black" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 3. Select Behavior
  if (step === 'SELECT_BEHAVIOR') {
    return (
      <div className="min-h-screen bg-slate-100 p-6">
        <header className="mb-6">
          <button 
            onClick={() => setStep('SELECT_TYPE')} 
            className="text-sm text-slate-500 mb-2 hover:underline"
          >
            &larr; 返回上一步
          </button>
          <h2 className="text-2xl font-bold text-slate-800">Ta 做了什么？</h2>
          <p className="text-slate-500 mt-1">请选择最让你窒息的操作</p>
        </header>

        <div className="space-y-3 max-w-md mx-auto">
          {selectedBoss?.behaviors.map((behavior, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectBehavior(behavior)}
              className="w-full bg-white p-4 rounded-xl border border-slate-200 text-left font-medium text-slate-700 hover:bg-yellow-50 hover:border-yellow-400 hover:text-yellow-900 transition-all shadow-sm active:scale-[0.98]"
            >
              “{behavior}”
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 4. Result View
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 flex flex-col items-center">
      
      {/* Loading State */}
      {loading === LoadingState.LOADING && (
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          <div className="space-y-2">
            <p className="text-xl font-bold animate-pulse">正在连线赛博算命师...</p>
            <p className="text-slate-400">正在分析其中的逻辑漏洞与职场黑话</p>
          </div>
        </div>
      )}

      {/* Result Display */}
      {loading === LoadingState.SUCCESS && result && (
        <div className="w-full max-w-md animate-[fadeIn_0.5s_ease-out]">
          {/* Header */}
          <div className="text-center mb-6">
            <span className="inline-block px-3 py-1 rounded-full border border-yellow-500/50 text-yellow-400 text-xs font-bold tracking-wider mb-2">
              DIAGNOSIS REPORT
            </span>
            <h2 className="text-3xl font-black">{result.summaryTag}</h2>
          </div>

          {/* Main Score Card */}
          <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700 shadow-2xl relative overflow-hidden mb-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500 rounded-full blur-[60px] opacity-20"></div>
            
            <div className="flex justify-between items-start mb-6">
               <div>
                 <h3 className="text-slate-400 text-sm font-bold uppercase">牛马指数</h3>
                 <div className="text-6xl font-black text-white mt-1">
                   {result.totalScore}<span className="text-2xl text-yellow-400">%</span>
                 </div>
               </div>
               <div className="bg-yellow-400 text-black font-bold px-3 py-1 rounded text-xs transform rotate-6">
                 {result.totalScore > 80 ? '极度危险' : result.totalScore > 50 ? '建议摸鱼' : '尚可忍受'}
               </div>
            </div>

            {/* Progress Bars */}
            <div className="space-y-4">
              <ScoreBar label="拍脑袋决策" score={result.scores.impulse} max={30} color="bg-red-500" />
              <ScoreBar label="工作量膨胀" score={result.scores.workload} max={30} color="bg-orange-500" />
              <ScoreBar label="精神内耗" score={result.scores.drain} max={30} color="bg-purple-500" />
              <ScoreBar label="幽默加成" score={result.scores.humor} max={10} color="bg-green-500" />
            </div>
          </div>

          {/* Roast Content */}
          <div className="bg-white text-slate-900 rounded-2xl p-6 shadow-[8px_8px_0px_0px_#94a3b8] mb-6 relative">
             <div className="absolute -top-3 left-6 bg-black text-white px-2 py-1 text-xs font-bold rounded">
               AI 锐评
             </div>
             <p className="text-lg font-medium leading-relaxed italic">
               “{result.roastContent}”
             </p>
             <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-sm text-slate-500 font-bold">
               <Award size={16} className="mr-2 text-yellow-500" />
               行为流派：{result.analysis}
             </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-4 pb-12">
            <button 
              onClick={handleRestart}
              className="bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl font-bold flex items-center justify-center transition-colors"
            >
              <RefreshCw size={18} className="mr-2" />
              再测一个
            </button>
            <button 
              className="bg-yellow-400 hover:bg-yellow-300 text-black py-3 rounded-xl font-bold flex items-center justify-center transition-colors shadow-lg shadow-yellow-400/20"
            >
              <Share2 size={18} className="mr-2" />
              晒朋友圈
            </button>
          </div>
        </div>
      )}

      {/* Error State */}
      {loading === LoadingState.ERROR && (
         <div className="text-center mt-20">
           <p className="text-red-400 mb-4">分析失败，看来你的领导过于离谱，把AI都整不会了。</p>
           <button onClick={handleRestart} className="underline text-white">重试</button>
         </div>
      )}
    </div>
  );
};

const ScoreBar = ({ label, score, max, color }: { label: string, score: number, max: number, color: string }) => {
  const percentage = Math.min((score / max) * 100, 100);
  return (
    <div>
      <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
        <span>{label}</span>
        <span>{score}/{max}</span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-1000 ease-out`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default App;
