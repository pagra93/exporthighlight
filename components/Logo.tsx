'use client';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className = '', size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-2 font-bold ${sizeClasses[size]} ${className}`}>
      <span className="text-gray-700 dark:text-gray-300">export.</span>
      <span className="relative text-gray-700 dark:text-gray-300">
        highlight
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-400 rounded-sm"></div>
      </span>
    </div>
  );
}
