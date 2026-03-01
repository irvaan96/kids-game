import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './Button';
import { X } from 'lucide-react';

interface ParentalGateProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function ParentalGate({ onSuccess, onCancel }: ParentalGateProps) {
  const [num1] = useState(Math.floor(Math.random() * 5) + 1);
  const [num2] = useState(Math.floor(Math.random() * 5) + 1);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(answer) === num1 * num2) {
      onSuccess();
    } else {
      setError(true);
      setAnswer('');
      setTimeout(() => setError(false), 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-8 max-w-sm w-full relative shadow-2xl"
      >
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Parents Area</h2>
          <p className="text-slate-500 text-sm">
            Solve this multiplication to enter settings.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="text-4xl font-black text-center text-indigo-600 tracking-widest">
            {num1} × {num2} = ?
          </div>

          <input
            type="number"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className={`w-full text-center text-3xl p-4 rounded-2xl border-4 outline-none transition-colors ${
              error ? 'border-rose-400 bg-rose-50 text-rose-600' : 'border-slate-200 focus:border-indigo-400'
            }`}
            autoFocus
            placeholder="Answer"
          />

          <Button type="submit" size="lg" className="w-full bg-indigo-500 hover:bg-indigo-400 shadow-[0_4px_0_rgb(79,70,229)] active:shadow-[0_0px_0_rgb(79,70,229)] text-white">
            Enter
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
