import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';
import { Button } from './Button';
import { playSound, speak } from '../../utils/audio';
import { Star } from 'lucide-react';

interface RewardScreenProps {
  onNext: () => void;
  onRestart?: () => void;
  starsEarned?: number;
  message?: string;
  isLastLevel?: boolean;
}

export function RewardScreen({ onNext, onRestart, starsEarned = 3, message = 'Great!', isLastLevel = false }: RewardScreenProps) {
  useEffect(() => {
    playSound('reward');
    speak(message);
    
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, [message]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col items-center gap-8 max-w-md w-full mx-4"
      >
        <h2 className="text-4xl md:text-5xl font-black text-amber-500 text-center drop-shadow-sm">
          {message}
        </h2>
        
        <div className="flex gap-4 justify-center">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: i * 0.2 + 0.5, type: 'spring' }}
            >
              <Star
                size={64}
                className={i < starsEarned ? "fill-amber-400 text-amber-500" : "fill-slate-200 text-slate-300"}
              />
            </motion.div>
          ))}
        </div>

        {isLastLevel ? (
          <div className="flex flex-col gap-3 w-full mt-4">
            <Button size="xl" onClick={onNext} className="w-full bg-emerald-500 hover:bg-emerald-400 shadow-[0_4px_0_rgb(16,185,129)] active:shadow-[0_0px_0_rgb(16,185,129)] text-white">
              Play Another Game
            </Button>
            <Button size="xl" variant="ghost" onClick={onRestart} className="w-full text-slate-500 hover:bg-slate-100">
              Play Again from Level 1
            </Button>
          </div>
        ) : (
          <Button size="xl" onClick={onNext} className="w-full mt-4">
            Play Next
          </Button>
        )}
      </motion.div>
    </motion.div>
  );
}
