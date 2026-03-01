import { useState } from 'react';
import { motion } from 'motion/react';
import { useGameStore, GameProgress } from '../store/useGameStore';
import { ArrowLeft, Clock, Star, Trophy, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export default function Dashboard() {
  const navigate = useNavigate();
  const { progress, totalStars, resetProgress } = useGameStore();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const categories = [
    { id: 'motorik', name: 'Fine Motor', color: 'bg-emerald-100 text-emerald-700', icon: '🖐️' },
    { id: 'kognitif', name: 'Basic Cognitive', color: 'bg-sky-100 text-sky-700', icon: '🧠' },
    { id: 'logika', name: 'Simple Logic', color: 'bg-amber-100 text-amber-700', icon: '🧩' },
    { id: 'emosi', name: 'Emotion & Social', color: 'bg-rose-100 text-rose-700', icon: '❤️' },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate('/')}
            className="p-4 bg-white rounded-full shadow-sm hover:bg-slate-100 active:scale-95 transition-transform"
          >
            <ArrowLeft size={24} className="text-slate-600" />
          </button>
          <h1 className="text-3xl font-bold text-slate-800">Parent Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-3xl shadow-sm flex items-center gap-4 border border-slate-100">
            <div className="p-4 bg-amber-100 rounded-2xl text-amber-600">
              <Star size={32} className="fill-amber-500" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Stars</p>
              <p className="text-3xl font-black text-slate-800">{totalStars}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm flex items-center gap-4 border border-slate-100">
            <div className="p-4 bg-indigo-100 rounded-2xl text-indigo-600">
              <Clock size={32} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Play Time</p>
              <p className="text-3xl font-black text-slate-800">
                {formatTime(Object.values(progress).reduce((acc: number, curr: GameProgress) => acc + curr.playTime, 0))}
              </p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm flex items-center gap-4 border border-slate-100">
            <div className="p-4 bg-emerald-100 rounded-2xl text-emerald-600">
              <Trophy size={32} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Levels Completed</p>
              <p className="text-3xl font-black text-slate-800">
                {Object.values(progress).reduce((acc: number, curr: GameProgress) => acc + curr.completedLevels, 0)}
              </p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-slate-800 mb-6">Child Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {categories.map((cat) => {
            const data = progress[cat.id];
            return (
              <motion.div 
                key={cat.id}
                whileHover={{ y: -4 }}
                className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className={`text-3xl p-4 rounded-2xl ${cat.color} flex items-center justify-center`}>
                    {cat.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">{cat.name}</h3>
                    <p className="text-sm text-slate-500">
                      Time: {formatTime(data.playTime)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <Star size={20} className="text-amber-500 fill-amber-500" />
                    <span className="font-bold text-slate-700">{data.stars} Stars</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy size={20} className="text-emerald-500" />
                    <span className="font-bold text-slate-700">{data.completedLevels} Levels</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="bg-rose-50 p-6 rounded-3xl border border-rose-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-rose-900">Reset Game Data</h3>
            <p className="text-rose-700 text-sm">Delete all stars, playtime, and completed levels.</p>
          </div>
          {showResetConfirm ? (
            <div className="flex gap-4">
              <Button variant="ghost" onClick={() => setShowResetConfirm(false)}>Cancel</Button>
              <Button variant="danger" onClick={() => { resetProgress(); setShowResetConfirm(false); }}>
                Yes, Delete Data
              </Button>
            </div>
          ) : (
            <Button variant="danger" onClick={() => setShowResetConfirm(true)} className="flex items-center gap-2">
              <RefreshCw size={20} />
              Reset Data
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
