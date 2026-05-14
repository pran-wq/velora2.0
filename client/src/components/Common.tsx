import { Key, ReactNode, HTMLAttributes } from 'react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  key?: Key;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export function GlassCard({ children, className, onClick, hover = true, ...props }: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={cn(
        "bg-white/40 backdrop-blur-[40px] border border-white/80 rounded-[32px] shadow-[0_20px_40px_rgba(0,0,0,0.05)]",
        onClick && "cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface ButtonProps {
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
}

export function Button({ 
  onClick, 
  children, 
  className, 
  variant = 'primary', 
  size = 'md',
  disabled 
}: ButtonProps) {
  const variants = {
    primary: "bg-primary text-white hover:bg-opacity-90 shadow-[0_10px_20px_rgba(0,0,0,0.1)]",
    secondary: "bg-white/50 backdrop-blur-md text-primary border border-white/80 shadow-sm hover:bg-white/70",
    ghost: "bg-transparent text-primary hover:bg-white/40 backdrop-blur-sm",
    danger: "bg-[#FDA4AF]/80 backdrop-blur-md text-white hover:bg-opacity-100 shadow-lg shadow-[#FDA4AF]/20 border border-white/50"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm rounded-full",
    md: "px-6 py-3 rounded-full font-medium",
    lg: "px-8 py-4 text-lg rounded-full font-medium",
    xl: "px-10 py-5 text-xl rounded-full font-semibold"
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </motion.button>
  );
}
