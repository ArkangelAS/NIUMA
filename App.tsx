import React, { useState, useEffect } from 'react';
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
  BatteryWarning,
  Award,
  ArrowLeft
} from 'lucide-react';
import { generateRoast } from './services/geminiService';
import { BossArchetype, RoastResult, LoadingState } from './types';

// --- Static Data ---
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

const BossIcon = ({ name, className }: { name: string; className?: string }) => {
  switch (name) {
    case 'PieChart': return <PieChart className={className} />;
    case 'Search': return <BrainCircuit className={className} />;
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

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

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

  const handleShare = async () => {
    if (result && navigator.share) {
      try {
        await navigator.share({
          title: '我的牛马指数报告',
          text: `我在【对牛谈马】测出了${result.totalScore}分！AI评语：${result.roastContent}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      alert('请截图分享给你的工友！');
    }
  };

  // --- Views ---

  // 1. Home View
  if (step === 'HOME') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-200 rounded-full blur-[80px] opacity-40 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-200 rounded-full blur-[80px] opacity-40 translate-y-1/3 -translate-x-1/2"></div>
        
        <div className="flex-1 flex flex-col justify-center items-center p-6 z-10 animate-fade-in-up">
          <div className="mb-8 relative">
            <div className="absolute inset-0 bg-yellow-400 rounded-2xl transform rotate-6 translate-x-2 translate-y-2"></div>
            <div className="relative bg-white p-6 rounded-2xl border-2 border-slate-900 shadow-xl">
              <Zap size={64} className="text-slate-900" />
            </div>
          </div>
          
          <h1 className="text-5xl font-black text-slate-900 mb-2 tracking-tight text-center">
            对牛谈马
          </h1>
          <p className="text-lg text-slate-600 font-medium mb-10 text-center max-w-xs">
            你的职场 <span className="bg-yellow-200 px-1 mx-1 rounded text-slate-900 font-bold">牛马指数</span> <br/>权威检测中心
          </p>

          <div className="w-full max-w-sm space-y-4 mb-10">
            {[
              { icon: AlertTriangle, color: 'text-red-500', text: '不仅干活，还要背锅？' },
              { icon: BatteryWarning, color: 'text-orange-500', text: '需求全靠拍脑袋？' },
              { icon: Coffee, color: 'text-blue-500', text: '测测你离离职还有多远。' }
            ].map((item, i) => (
              <div key={i} className="flex items-center bg-white/80 backdrop-blur p-4 rounded-xl border border-slate-200 shadow-sm">
                <item.icon className={`mr-4 ${item.color} shrink-0`} size={24} />
                <span className="text-slate-700 font-bold">{item.text}</span>
              </div>
            ))}
          </div>

          <button 
            onClick={handleStart}
            className="w-full max-w-sm bg-slate-900 text-white text-xl font-bold py-5 rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.2)] active:scale-95 transition-transform flex items-center justify-center"
          >
            开始诊断
            <ChevronRight className="ml-2" />
          </button>
        </div>
      </div>
    );
  }

  // 2. Select Boss Type
  if (step === 'SELECT_TYPE') {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col animate-slide-in">
        <header className="bg-white/90 backdrop-blur sticky top-0 z-20 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <button onClick={() => setStep('HOME')} className="p-2 -ml-2 text-slate-600">
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-lg font-bold text-slate-900">选择领导类型</h2>
          <span className="text-xs font-bold bg-slate-200 text-slate-600 px-2 py-1 rounded">1/2</span>
        </header>

        <div className="flex-1 p-6 pb-24 overflow-y-auto">
          <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
            {BOSS_TYPES.map((boss, idx) => (
              <button
                key={boss.id}
                onClick={() => handleSelectType(boss)}
                className="bg-white p-5 rounded-xl border-2 border-transparent hover:border-slate-900 shadow-sm hover:shadow-lg transition-all text-left flex items-center group active:scale-[0.98]"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="bg-slate-100 p-3 rounded-xl mr-4 group-hover:bg-yellow-400 transition-colors">
                  <BossIcon name={boss.iconName} className="text-slate-800" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-slate-900">{boss.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">{boss.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 3. Select Behavior
  if (step === 'SELECT_BEHAVIOR') {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col animate-slide-in">
        <header className="bg-white/90 backdrop-blur sticky top-0 z-20 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <button onClick={() => setStep('SELECT_TYPE')} className="p-2 -ml-2 text-slate-600">
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-lg font-bold text-slate-900">Ta 做了什么？</h2>
          <span className="text-xs font-bold bg-slate-200 text-slate-600 px-2 py-1 rounded">2/2</span>
        </header>

        <div className="flex-1 p-6 pb-24">
          <div className="space-y-4 max-w-md mx-auto">
            <div className="text-sm text-slate-500 mb-4 px-2">
              <span className="font-bold text-slate-900">{selectedBoss?.name}</span> 的经典语录：
            </div>
            {selectedBoss?.behaviors.map((behavior, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectBehavior(behavior)}
                className="w-full bg-white p-5 rounded-xl border border-slate-200 text-left font-medium text-slate-700 hover:bg-yellow-50 hover:border-yellow-400 transition-all shadow-sm active:scale-[0.98] animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                “{behavior}”
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 4. Result View
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col animate-fade-in-up">
      
      {/* Loading State */}
      {loading === LoadingState.LOADING && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-slate-700 rounded-full"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="space-y-3">
            <p className="text-2xl font-bold animate-pulse text-yellow-400">正在连线赛博算命师...</p>
            <p className="text-slate-400 text-sm">正在分析其中的逻辑漏洞与职场黑话<br/>计算你的精神损失费...</p>
          </div>
        </div>
      )}

      {/* Result Display */}
      {loading === LoadingState.SUCCESS && result && (
        <div className="flex-1 flex flex-col">
          {/* Top Gradient */}
          <div className="h-2 bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600"></div>

          <div className="flex-1 p-6 pb-32 overflow-y-auto no-scrollbar">
            <div className="max-w-md mx-auto w-full">
              
              {/* Header */}
              <div className="text-center mb-8 pt-4">
                <div className="inline-block px-3 py-1 rounded-full border border-yellow-500/30 text-yellow-400 text-xs font-bold tracking-widest mb-3">
                  诊断报告 REPORT
                </div>
                <h2 className="text-4xl font-black tracking-tight">{result.summaryTag}</h2>
              </div>

              {/* Main Score Card */}
              <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700 shadow-2xl relative overflow-hidden mb-6">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-500 rounded-full blur-[80px] opacity-20"></div>
                
                <div className="flex justify-between items-end mb-8 relative z-10">
                   <div>
                     <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">牛马指数 NIUMA INDEX</h3>
                     <div className="flex items-baseline">
                       <span className="text-7xl font-black text-white leading-none tracking-tighter">
                         {result.totalScore}
                       </span>
                       <span className="text-2xl text-yellow-500 font-bold ml-1">%</span>
                     </div>
                   </div>
                   <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 font-bold px-3 py-1.5 rounded-lg text-sm transform rotate-3 shadow-lg">
                     {result.totalScore > 80 ? '极度危险 ☠️' : result.totalScore > 50 ? '建议摸鱼 🐟' : '尚可忍受 😐'}
                   </div>
                </div>

                {/* Progress Bars */}
                <div className="space-y-5 relative z-10">
                  <ScoreBar label="拍脑袋决策" score={result.scores.impulse} max={30} color="bg-red-500" />
                  <ScoreBar label="工作量膨胀" score={result.scores.workload} max={30} color="bg-orange-500" />
                  <ScoreBar label="精神内耗" score={result.scores.drain} max={30} color="bg-purple-500" />
                  <ScoreBar label="幽默加成" score={result.scores.humor} max={10} color="bg-green-500" />
                </div>
              </div>

              {/* Roast Content */}
              <div className="bg-white text-slate-900 rounded-2xl p-6 shadow-xl mb-6 relative mx-2 rotate-1 transform transition-transform hover:rotate-0">
                 <div className="absolute -top-3 -left-2 bg-slate-900 text-white px-3 py-1 text-xs font-bold rounded-lg shadow-lg">
                   AI 锐评
                 </div>
                 <Ghost className="absolute bottom-4 right-4 text-slate-100 -z-0" size={64} />
                 <p className="text-lg font-medium leading-relaxed italic relative z-10">
                   “{result.roastContent}”
                 </p>
                 <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-xs text-slate-500 font-bold uppercase tracking-wide">
                   <Award size={14} className="mr-2 text-yellow-600" />
                   流派：{result.analysis}
                 </div>
              </div>
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900/90 backdrop-blur border-t border-slate-800 z-50">
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <button 
                onClick={handleRestart}
                className="bg-slate-800 hover:bg-slate-700 text-white py-3.5 rounded-xl font-bold flex items-center justify-center transition-colors border border-slate-700"
              >
                <RefreshCw size={18} className="mr-2" />
                重测
              </button>
              <button 
                onClick={handleShare}
                className="bg-yellow-400 hover:bg-yellow-300 text-slate-900 py-3.5 rounded-xl font-bold flex items-center justify-center transition-colors shadow-lg shadow-yellow-400/20 active:translate-y-0.5"
              >
                <Share2 size={18} className="mr-2" />
                分享
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {loading === LoadingState.ERROR && (
         <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
           <AlertTriangle size={48} className="text-red-500 mb-4" />
           <p className="text-xl font-bold mb-2">系统崩溃了</p>
           <p className="text-slate-400 mb-8">看来你的领导过于离谱，连AI都被整破防了。</p>
           <button 
             onClick={handleRestart} 
             className="px-8 py-3 bg-white text-slate-900 rounded-xl font-bold"
           >
             重试一次
           </button>
         </div>
      )}
    </div>
  );
};

const ScoreBar = ({ label, score, max, color }: { label: string, score: number, max: number, color: string }) => {
  const percentage = Math.min((score / max) * 100, 100);
  return (
    <div>
      <div className="flex justify-between text-xs font-bold text-slate-400 mb-1.5">
        <span>{label}</span>
        <span className="text-white">{score} <span className="text-slate-600">/ {max}</span></span>
      </div>
      <div className="h-2.5 bg-slate-900/50 rounded-full overflow-hidden border border-slate-700/50">
        <div 
          className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default App;