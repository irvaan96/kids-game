import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { RewardScreen } from '../../components/ui/RewardScreen';
import { playSound, speak } from '../../utils/audio';
import { useGameStore } from '../../store/useGameStore';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SHAPES = [
  { id: 'circle', name: 'Circle', color: 'bg-rose-400', path: 'M50 10 a40 40 0 1 0 0 80 a40 40 0 1 0 0 -80' },
  { id: 'square', name: 'Square', color: 'bg-sky-400', path: 'M10 10 h80 v80 h-80 z' },
  { id: 'triangle', name: 'Triangle', color: 'bg-amber-400', path: 'M50 10 L90 90 L10 90 Z' },
  { id: 'star', name: 'Star', color: 'bg-yellow-400', path: 'M50 5 L61 35 L95 35 L67 55 L78 85 L50 65 L22 85 L33 55 L5 35 L39 35 Z' },
  { id: 'heart', name: 'Heart', color: 'bg-pink-400', path: 'M50 30 C50 30 45 10 25 10 C5 10 5 40 5 40 C5 60 50 90 50 90 C50 90 95 60 95 40 C95 40 95 10 75 10 C55 10 50 30 50 30 Z' },
  { id: 'hexagon', name: 'Hexagon', color: 'bg-purple-400', path: 'M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z' },
];

export default function ShapeMatch() {
  const navigate = useNavigate();
  const { addStars, completeLevel, addPlayTime, progress, resetCategoryLevel } = useGameStore();

  const [startTime] = useState(Date.now());
  const [targetShape, setTargetShape] = useState(SHAPES[0]);
  const [options, setOptions] = useState<typeof SHAPES>([]);
  const [isWon, setIsWon] = useState(false);
  const [draggedShape, setDraggedShape] = useState<string | null>(null);

  const currentLevel = Math.min(15, progress.motorik.completedLevels + 1);
  const isLastLevel = progress.motorik.completedLevels >= 14;

  const initGame = () => {
    const numOptions = currentLevel < 6 ? 3 : currentLevel < 11 ? 4 : 6;
    const availableShapes = SHAPES.slice(0, Math.min(SHAPES.length, numOptions + 1));
    
    const shuffled = [...availableShapes].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, numOptions);
    const target = selected[Math.floor(Math.random() * selected.length)];
    
    setTargetShape(target);
    setOptions(selected);
    setIsWon(false);
    setDraggedShape(null);
    speak(`Let's match the ${target.name}`);
  };

  useEffect(() => {
    initGame();
    return () => {
      addPlayTime('motorik', Math.floor((Date.now() - startTime) / 1000));
    };
  }, []);

  const handleDragEnd = (event: any, info: any, shapeId: string) => {
    // Simple collision detection for prototype
    // In a real app, use bounding client rects
    const dropZone = document.getElementById('drop-zone');
    if (dropZone) {
      const rect = dropZone.getBoundingClientRect();
      const x = info.point.x;
      const y = info.point.y;

      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        if (shapeId === targetShape.id) {
          playSound('success');
          setIsWon(true);
          addStars('motorik', 1);
          if (!isLastLevel || progress.motorik.completedLevels === 14) {
            completeLevel('motorik');
          }
        } else {
          playSound('wrong');
          speak('Try again!');
        }
      }
    }
    setDraggedShape(null);
  };

  const handleNext = () => {
    if (isLastLevel) {
      navigate('/');
    } else {
      initGame();
    }
  };

  const handleRestart = () => {
    resetCategoryLevel('motorik');
    // The component will re-render, but we need to call initGame manually 
    // because currentLevel is not in the dependency array of useEffect anymore
    setTimeout(() => {
      initGame();
    }, 0);
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <button 
          onClick={() => navigate('/')}
          className="p-4 bg-white rounded-full shadow-md hover:bg-slate-50 active:scale-95 transition-transform"
        >
          <ArrowLeft size={32} className="text-slate-600" />
        </button>
        <div className="flex flex-col items-end">
          <div className="bg-white px-6 py-3 rounded-full shadow-sm font-bold text-emerald-600 text-xl">
            Fine Motor
          </div>
          <div className="text-sm font-bold text-emerald-500 mt-2 bg-emerald-100 px-3 py-1 rounded-full">
            Level {currentLevel} / 15
          </div>
        </div>
      </div>

      <h1 className="text-3xl md:text-5xl font-black text-slate-800 text-center mb-12 drop-shadow-sm">
        Match the <span className="text-emerald-500">{targetShape.name}</span>
      </h1>

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl gap-16">
        {/* Drop Zone */}
        <div 
          id="drop-zone"
          className="w-48 h-48 md:w-64 md:h-64 border-8 border-dashed border-slate-300 rounded-3xl flex items-center justify-center bg-white/50 relative"
        >
          <svg viewBox="0 0 100 100" className="w-3/4 h-3/4 opacity-20 fill-slate-400">
            <path d={targetShape.path} />
          </svg>
          {isWon && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`absolute inset-0 m-4 rounded-2xl ${targetShape.color} flex items-center justify-center`}
            >
              <svg viewBox="0 0 100 100" className="w-3/4 h-3/4 fill-white">
                <path d={targetShape.path} />
              </svg>
            </motion.div>
          )}
        </div>

        {/* Draggable Options */}
        <div className="flex flex-wrap gap-4 md:gap-8 justify-center w-full">
          {options.map((shape) => (
            <motion.div
              key={shape.id}
              drag={!isWon}
              dragSnapToOrigin
              onDragStart={() => setDraggedShape(shape.id)}
              onDragEnd={(e, info) => handleDragEnd(e, info, shape.id)}
              whileHover={{ scale: 1.1 }}
              whileDrag={{ scale: 1.2, zIndex: 50 }}
              className={`w-20 h-20 md:w-28 md:h-28 rounded-2xl ${shape.color} flex items-center justify-center shadow-lg cursor-grab active:cursor-grabbing ${
                isWon && shape.id === targetShape.id ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <svg viewBox="0 0 100 100" className="w-3/4 h-3/4 fill-white drop-shadow-sm">
                <path d={shape.path} />
              </svg>
            </motion.div>
          ))}
        </div>
      </div>

      {isWon && (
        <RewardScreen 
          onNext={handleNext} 
          onRestart={handleRestart}
          message={`Great! That's a ${targetShape.name}`} 
          isLastLevel={isLastLevel}
        />
      )}
    </div>
  );
}
