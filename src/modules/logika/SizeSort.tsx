import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { RewardScreen } from '../../components/ui/RewardScreen';
import { playSound, speak } from '../../utils/audio';
import { useGameStore } from '../../store/useGameStore';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ANIMALS = [
  { id: 'elephant', emoji: '🐘', name: 'Elephant' },
  { id: 'cat', emoji: '🐱', name: 'Cat' },
  { id: 'mouse', emoji: '🐭', name: 'Mouse' },
  { id: 'bear', emoji: '🐻', name: 'Bear' },
  { id: 'frog', emoji: '🐸', name: 'Frog' },
];

export default function SizeSort() {
  const navigate = useNavigate();
  const { addStars, completeLevel, addPlayTime, progress, resetCategoryLevel } = useGameStore();

  const [startTime] = useState(Date.now());
  const [targetAnimal, setTargetAnimal] = useState(ANIMALS[0]);
  const [options, setOptions] = useState<{ id: string, size: number }[]>([]);
  const [isWon, setIsWon] = useState(false);
  const [findBiggest, setFindBiggest] = useState(true);

  const currentLevel = Math.min(15, progress.logika.completedLevels + 1);
  const isLastLevel = progress.logika.completedLevels >= 14;

  const initGame = () => {
    const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
    
    let sizes = [1, 1.5, 2];
    if (currentLevel >= 6 && currentLevel < 11) {
      sizes = [0.8, 1.2, 1.6, 2];
    } else if (currentLevel >= 11) {
      sizes = [0.6, 1, 1.4, 1.8, 2.2];
    }

    const shuffledSizes = [...sizes].sort(() => 0.5 - Math.random());
    
    const isBiggest = Math.random() > 0.5;
    
    setTargetAnimal(animal);
    setFindBiggest(isBiggest);
    setOptions(shuffledSizes.map((size, i) => ({ id: `${animal.id}-${i}`, size })));
    setIsWon(false);
    
    speak(`Which ${animal.name} is the ${isBiggest ? 'biggest' : 'smallest'}?`);
  };

  useEffect(() => {
    initGame();
    return () => {
      addPlayTime('logika', Math.floor((Date.now() - startTime) / 1000));
    };
  }, []);

  const handleSelect = (size: number) => {
    if (isWon) return;
    
    const allSizes = options.map(o => o.size);
    const targetSize = findBiggest ? Math.max(...allSizes) : Math.min(...allSizes);
    const isCorrect = size === targetSize;
    
    if (isCorrect) {
      playSound('success');
      setIsWon(true);
      addStars('logika', 1);
      if (!isLastLevel || progress.logika.completedLevels === 14) {
        completeLevel('logika');
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
    resetCategoryLevel('logika');
    setTimeout(() => {
      initGame();
    }, 0);
  };

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <button 
          onClick={() => navigate('/')}
          className="p-4 bg-white rounded-full shadow-md hover:bg-slate-50 active:scale-95 transition-transform"
        >
          <ArrowLeft size={32} className="text-slate-600" />
        </button>
        <div className="flex flex-col items-end">
          <div className="bg-white px-6 py-3 rounded-full shadow-sm font-bold text-amber-600 text-xl">
            Simple Logic
          </div>
          <div className="text-sm font-bold text-amber-500 mt-2 bg-amber-100 px-3 py-1 rounded-full">
            Level {currentLevel} / 15
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-3xl gap-16">
        <h1 className="text-4xl md:text-5xl font-black text-slate-800 text-center drop-shadow-sm">
          Which {targetAnimal.name} is the <br/>
          <span className="text-amber-500 text-5xl md:text-7xl">
            {findBiggest ? 'BIGGEST' : 'SMALLEST'}
          </span>?
        </h1>

        <div className="flex items-end justify-center gap-8 md:gap-16 w-full h-64">
          {options.map((option, index) => (
            <motion.button
              key={option.id}
              initial={{ scale: 0, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: index * 0.1, type: 'spring' }}
              whileHover={{ scale: 1.05, y: -10 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(option.size)}
              className="relative flex flex-col items-center justify-end"
            >
              <div 
                className="text-center drop-shadow-xl select-none"
                style={{ fontSize: `${option.size * 4}rem`, lineHeight: 1 }}
              >
                {targetAnimal.emoji}
              </div>
              <div className="w-full h-4 bg-black/10 rounded-full mt-4 blur-sm" />
            </motion.button>
          ))}
        </div>
      </div>

      {isWon && (
        <RewardScreen 
          onNext={handleNext} 
          onRestart={handleRestart}
          message={`Smart! That's the ${findBiggest ? 'biggest' : 'smallest'} one`} 
          isLastLevel={isLastLevel}
        />
      )}
    </div>
  );
}
