import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { RewardScreen } from '../../components/ui/RewardScreen';
import { playSound, speak } from '../../utils/audio';
import { useGameStore } from '../../store/useGameStore';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const COLORS = [
  { id: 'red', name: 'Red', hex: 'bg-rose-500', textClass: 'text-rose-500' },
  { id: 'blue', name: 'Blue', hex: 'bg-sky-500', textClass: 'text-sky-500' },
  { id: 'yellow', name: 'Yellow', hex: 'bg-amber-400', textClass: 'text-amber-500' },
  { id: 'green', name: 'Green', hex: 'bg-emerald-500', textClass: 'text-emerald-500' },
  { id: 'purple', name: 'Purple', hex: 'bg-purple-500', textClass: 'text-purple-500' },
  { id: 'orange', name: 'Orange', hex: 'bg-orange-500', textClass: 'text-orange-500' },
  { id: 'pink', name: 'Pink', hex: 'bg-pink-400', textClass: 'text-pink-500' },
  { id: 'brown', name: 'Brown', hex: 'bg-amber-800', textClass: 'text-amber-800' },
  { id: 'black', name: 'Black', hex: 'bg-slate-900', textClass: 'text-slate-900' },
];

export default function ColorMatch() {
  const navigate = useNavigate();
  const { addStars, completeLevel, addPlayTime, progress, resetCategoryLevel } = useGameStore();

  const [startTime] = useState(Date.now());
  const [targetColor, setTargetColor] = useState(COLORS[0]);
  const [options, setOptions] = useState<typeof COLORS>([]);
  const [isWon, setIsWon] = useState(false);

  const currentLevel = Math.min(15, progress.kognitif.completedLevels + 1);
  const isLastLevel = progress.kognitif.completedLevels >= 14;

  const initGame = () => {
    const numOptions = currentLevel < 6 ? 3 : currentLevel < 11 ? 4 : 6;
    const availableColors = COLORS.slice(0, Math.min(COLORS.length, numOptions + 3));

    const shuffled = [...availableColors].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, numOptions);
    const target = selected[Math.floor(Math.random() * selected.length)];
    
    setTargetColor(target);
    setOptions(selected);
    setIsWon(false);
    speak(`Which one is ${target.name}?`);
  };

  useEffect(() => {
    initGame();
    return () => {
      addPlayTime('kognitif', Math.floor((Date.now() - startTime) / 1000));
    };
  }, []);

  const handleSelect = (colorId: string) => {
    if (isWon) return;
    
    if (colorId === targetColor.id) {
      playSound('success');
      setIsWon(true);
      addStars('kognitif', 1);
      if (!isLastLevel || progress.kognitif.completedLevels === 14) {
        completeLevel('kognitif');
      }
    } else {
      playSound('wrong');
      speak('Not that one, try again!');
    }
  };

  const handleNext = () => {
    if (isLastLevel) {
      navigate('/');
    } else {
      initGame();
    }
  };

  const handleRestart = () => {
    resetCategoryLevel('kognitif');
    setTimeout(() => {
      initGame();
    }, 0);
  };

  return (
    <div className="min-h-screen bg-sky-50 flex flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <button 
          onClick={() => navigate('/')}
          className="p-4 bg-white rounded-full shadow-md hover:bg-slate-50 active:scale-95 transition-transform"
        >
          <ArrowLeft size={32} className="text-slate-600" />
        </button>
        <div className="flex flex-col items-end">
          <div className="bg-white px-6 py-3 rounded-full shadow-sm font-bold text-sky-600 text-xl">
            Basic Cognitive
          </div>
          <div className="text-sm font-bold text-sky-500 mt-2 bg-sky-100 px-3 py-1 rounded-full">
            Level {currentLevel} / 15
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl gap-12">
        <h1 className="text-4xl md:text-6xl font-black text-slate-800 text-center drop-shadow-sm">
          Which one is <br/>
          <span className={targetColor.textClass}>
            {targetColor.name}
          </span>?
        </h1>

        <div className="flex flex-wrap justify-center gap-6 md:gap-12 w-full">
          {options.map((color, index) => (
            <motion.button
              key={color.id}
              initial={{ scale: 0, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: index * 0.1, type: 'spring' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(color.id)}
              className={`w-24 h-24 md:w-40 md:h-40 rounded-full ${color.hex} shadow-xl border-8 border-white/20 relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent" />
              <div className="absolute top-2 left-4 w-6 h-6 md:w-10 md:h-10 bg-white/30 rounded-full blur-sm" />
            </motion.button>
          ))}
        </div>
      </div>

      {isWon && (
        <RewardScreen 
          onNext={handleNext} 
          onRestart={handleRestart}
          message={`Awesome! That's ${targetColor.name}`} 
          isLastLevel={isLastLevel}
        />
      )}
    </div>
  );
}
