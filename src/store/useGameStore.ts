import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type GameCategory = 'motorik' | 'kognitif' | 'logika' | 'emosi';

export interface GameProgress {
  stars: number;
  playTime: number; // in seconds
  completedLevels: number;
}

interface GameState {
  progress: Record<GameCategory, GameProgress>;
  totalStars: number;
  addStars: (category: GameCategory, amount: number) => void;
  addPlayTime: (category: GameCategory, seconds: number) => void;
  completeLevel: (category: GameCategory) => void;
  resetProgress: () => void;
  resetCategoryLevel: (category: GameCategory) => void;
}

const initialProgress: Record<GameCategory, GameProgress> = {
  motorik: { stars: 0, playTime: 0, completedLevels: 0 },
  kognitif: { stars: 0, playTime: 0, completedLevels: 0 },
  logika: { stars: 0, playTime: 0, completedLevels: 0 },
  emosi: { stars: 0, playTime: 0, completedLevels: 0 },
};

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      progress: initialProgress,
      totalStars: 0,
      addStars: (category, amount) =>
        set((state) => ({
          progress: {
            ...state.progress,
            [category]: {
              ...state.progress[category],
              stars: state.progress[category].stars + amount,
            },
          },
          totalStars: state.totalStars + amount,
        })),
      addPlayTime: (category, seconds) =>
        set((state) => ({
          progress: {
            ...state.progress,
            [category]: {
              ...state.progress[category],
              playTime: state.progress[category].playTime + seconds,
            },
          },
        })),
      completeLevel: (category) =>
        set((state) => ({
          progress: {
            ...state.progress,
            [category]: {
              ...state.progress[category],
              completedLevels: state.progress[category].completedLevels + 1,
            },
          },
        })),
      resetCategoryLevel: (category) =>
        set((state) => ({
          progress: {
            ...state.progress,
            [category]: {
              ...state.progress[category],
              completedLevels: 0,
            },
          },
        })),
      resetProgress: () => set({ progress: initialProgress, totalStars: 0 }),
    }),
    {
      name: 'dunia-ceria-storage',
    }
  )
);
