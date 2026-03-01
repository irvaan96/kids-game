import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ParentalGate } from '../components/ui/ParentalGate';
import { playSound, speak } from '../utils/audio';
import { Settings, Play, Star } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';

export default function Home() {
  const navigate = useNavigate();
  const [showParentalGate, setShowParentalGate] = useState(false);
  const totalStars = useGameStore((state) => state.totalStars);

  const handlePlay = (path: string, name: string) => {
    playSound('click');
    speak(`Let's play ${name}!`);
    navigate(path);
  };

  const categories = [
    {
      id: 'motorik',
      name: 'Fine Motor',
      desc: 'Match Shapes',
      color: 'bg-emerald-400',
      shadow: 'shadow-[0_8px_0_rgb(5,150,105)]',
      activeShadow: 'active:shadow-[0_0px_0_rgb(5,150,105)]',
      path: '/play/motorik',
      icon: '🖐️',
    },
    {
      id: 'kognitif',
      name: 'Basic Cognitive',
      desc: 'Guess Colors',
      color: 'bg-sky-400',
      shadow: 'shadow-[0_8px_0_rgb(2,132,199)]',
      activeShadow: 'active:shadow-[0_0px_0_rgb(2,132,199)]',
      path: '/play/kognitif',
      icon: '🧠',
    },
    {
      id: 'logika',
      name: 'Simple Logic',
      desc: 'Big & Small',
      color: 'bg-amber-400',
      shadow: 'shadow-[0_8px_0_rgb(217,119,6)]',
      activeShadow: 'active:shadow-[0_0px_0_rgb(217,119,6)]',
      path: '/play/logika',
      icon: '🧩',
    },
    {
      id: 'emosi',
      name: 'Emotion & Social',
      desc: 'Guess Emotion',
      color: 'bg-rose-400',
      shadow: 'shadow-[0_8px_0_rgb(225,29,72)]',
      activeShadow: 'active:shadow-[0_0px_0_rgb(225,29,72)]',
      path: '/play/emosi',
      icon: '❤️',
    },
  ];

  return (
    <div className="min-h-screen bg-indigo-50 flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
      <div className="absolute top-10 right-10 w-32 h-32 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-32 h-32 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />

      <div className="w-full max-w-4xl z-10 flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-12">
          <div className="bg-white px-6 py-3 rounded-full shadow-md flex items-center gap-2 border-2 border-amber-100">
            <Star className="text-amber-500 fill-amber-500" size={28} />
            <span className="text-2xl font-black text-amber-600">{totalStars}</span>
          </div>
          
          <button
            onClick={() => setShowParentalGate(true)}
            className="p-4 bg-white rounded-full shadow-md hover:bg-slate-50 active:scale-95 transition-transform border-2 border-slate-100"
          >
            <Settings size={28} className="text-slate-600" />
          </button>
        </div>

        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-black text-indigo-900 drop-shadow-sm mb-4">
            Happy Kids <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400">
              World
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-indigo-600 font-medium">
            Learn while playing!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
          {categories.map((cat, index) => (
            <motion.button
              key={cat.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.2, type: 'spring' }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePlay(cat.path, cat.name)}
              className={`relative flex flex-col items-center justify-center p-8 rounded-3xl ${cat.color} ${cat.shadow} ${cat.activeShadow} transition-all border-4 border-white/20 group overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent" />
              <div className="text-6xl mb-4 drop-shadow-lg group-hover:scale-110 transition-transform z-10">
                {cat.icon}
              </div>
              <h2 className="text-2xl font-black text-white drop-shadow-md z-10 text-center leading-tight">
                {cat.name}
              </h2>
              <p className="text-white/90 font-bold mt-2 z-10 bg-black/10 px-4 py-1 rounded-full text-sm">
                {cat.desc}
              </p>
            </motion.button>
          ))}
        </div>
      </div>

      {showParentalGate && (
        <ParentalGate
          onSuccess={() => {
            setShowParentalGate(false);
            navigate('/dashboard');
          }}
          onCancel={() => setShowParentalGate(false)}
        />
      )}
    </div>
  );
}
