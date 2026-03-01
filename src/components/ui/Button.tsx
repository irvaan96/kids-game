import { motion } from 'motion/react';
import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { playSound } from '../../utils/audio';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, onClick, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-full font-bold transition-colors focus:outline-none focus:ring-4 focus:ring-opacity-50 active:scale-95';
    
    const variants = {
      primary: 'bg-amber-400 text-amber-900 hover:bg-amber-300 focus:ring-amber-400 shadow-[0_4px_0_rgb(217,119,6)] active:shadow-[0_0px_0_rgb(217,119,6)] active:translate-y-1',
      secondary: 'bg-sky-400 text-sky-900 hover:bg-sky-300 focus:ring-sky-400 shadow-[0_4px_0_rgb(2,132,199)] active:shadow-[0_0px_0_rgb(2,132,199)] active:translate-y-1',
      danger: 'bg-rose-400 text-rose-900 hover:bg-rose-300 focus:ring-rose-400 shadow-[0_4px_0_rgb(225,29,72)] active:shadow-[0_0px_0_rgb(225,29,72)] active:translate-y-1',
      ghost: 'bg-transparent hover:bg-black/5 text-slate-700',
      icon: 'bg-white text-slate-700 hover:bg-slate-50 shadow-md rounded-full aspect-square p-0',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-lg',
      lg: 'px-8 py-4 text-2xl',
      xl: 'px-12 py-6 text-3xl',
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      playSound('click');
      if (onClick) onClick(e);
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        className={cn(baseStyles, variants[variant], variant !== 'icon' && sizes[size], className)}
        onClick={handleClick}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
Button.displayName = 'Button';
