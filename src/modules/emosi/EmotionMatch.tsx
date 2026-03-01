import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { RewardScreen } from '../../components/ui/RewardScreen';
import { playSound, speak } from '../../utils/audio';
import { useGameStore } from '../../store/useGameStore';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EMOTIONS = [
  { id: 'happy', emoji: '😀', name: 'Happy', color: 'bg-amber-400' },
  { id: 'sad', emoji: '😢', name: 'Sad', color: 'bg-blue-400' },
  { id: 'angry', emoji: '😡', name: 'Angry', color: 'bg-red-400' },
  { id: 'surprised', emoji: '😲', name: 'Surprised', color: 'bg-purple-400' },
  { id: 'sleepy', emoji: '😴', name: 'Sleepy', color: 'bg-indigo-400' },
  { id: 'scared', emoji: '😨', name: 'Scared', color: 'bg-teal-400' },
  { id: 'silly', emoji: '🤪', name: 'Silly', color: 'bg-pink-400' },
  { id: 'cool', emoji: '😎', name: 'Cool', color: 'bg-slate-400' },
  { id: 'sick', emoji: '🤒', name: 'Sick', color: 'bg-lime-400' },
];

export default function EmotionMatch() {
  const navigate = useNavigate();
  const { addStars, completeLevel, addPlayTime, progress, resetCategoryLevel } = useGameStore();

  const [startTime] = useState(Date.now());
  const [targetEmotion, setTargetEmotion] = useState(EMOTIONS[0]);
  const [options, setOptions] = useState<typeof EMOTIONS>([]);
  const [isWon, setIsWon] = useState(false);

  const currentLevel = Math.min(15, progress.emosi.completedLevels + 1);
  const isLastLevel = progress.emosi.completedLevels >= 14;

  const initGame = () => {
    const numOptions = currentLevel < 6 ? 3 : currentLevel < 11 ? 4 : 6;
    const availableEmotions = EMOTIONS.slice(0, Math.min(EMOTIONS.length, numOptions + 3));

    const shuffled = [...availableEmotions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, numOptions);
    const target = selected[Math.floor(Math.random() * selected.length)];
    
    setTargetEmotion(target);
    setOptions(selected);
    setIsWon(false);
    
    speak(`Who is feeling ${target.name}?`);
  };

  useEffect(() => {
    initGame();
    return () => {
      addPlayTime('emosi', Math.floor((Date.now() - startTime) / 1000));
    };
  }, []);

  const handleSelect = (emotionId: string) => {
    if (isWon) return;
    
    if (emotionId === targetEmotion.id) {
      playSound('success');
      setIsWon(true);
      addStars('emosi', 1);
      if (!isLastLevel || progress.emosi.completedLevels === 14) {
        completeLevel('emosi');
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
    resetCategoryLevel('emosi');
    setTimeout(() => {
      initGame();
    }, 0);
  };

  return (
    <div className="min-h-screen bg-rose-50 flex flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <button 
          onClick={() => navigate('/')}
          className="p-4 bg-white rounded-full shadow-md hover:bg-slate-50 active:scale-95 transition-transform"
        >
          <ArrowLeft size={32} className="text-slate-600" />
        </button>
        <div className="flex flex-col items-end">
          <div className="bg-white px-6 py-3 rounded-full shadow-sm font-bold text-rose-600 text-xl">
            Emotion & Social
          </div>
          <div className="text-sm font-bold text-rose-500 mt-2 bg-rose-100 px-3 py-1 rounded-full">
            Level {currentLevel} / 15
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-3xl gap-12">
        <h1 className="text-4xl md:text-6xl font-black text-slate-800 text-center drop-shadow-sm">
          Who is feeling <br/>
          <span className="text-rose-500">
            {targetEmotion.name}
          </span>?
        </h1>

        <div className="flex flex-wrap justify-center gap-6 md:gap-12 w-full">
          {options.map((emotion, index) => (
            <motion.button
              key={emotion.id}
              initial={{ scale: 0, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: index * 0.1, type: 'spring' }}
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(emotion.id)}
              className={`w-24 h-24 md:w-40 md:h-40 rounded-full ${emotion.color} shadow-xl border-8 border-white/50 flex items-center justify-center relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent" />
              <span className="text-5xl md:text-7xl drop-shadow-lg relative z-10">
                {emotion.emoji}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {isWon && (
        <RewardScreen 
          onNext={handleNext} 
          onRestart={handleRestart}
          message={`Awesome! That's ${targetEmotion.name}`} 
          isLastLevel={isLastLevel}
        />
      )}
    </div>
  );
}
