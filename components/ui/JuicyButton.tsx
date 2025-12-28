import React from 'react';

type JuicyButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  className?: string;
  fullWidth?: boolean;
  disabled?: boolean;
};

export const JuicyButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  fullWidth = false,
  disabled = false,
}: JuicyButtonProps) => {
  const variants = {
    primary: {
      bg: 'bg-[#5c1916]',
      border: 'border-[#3f0f0d]',
      text: 'text-white',
      hover: 'hover:bg-[#732622]',
    },
    secondary: {
      bg: 'bg-[#A6D8D4]',
      border: 'border-[#7CB2AE]',
      text: 'text-white',
      hover: 'hover:bg-[#B8E6E2]',
    },
    outline: {
      bg: 'bg-[#F5F5F5]',
      border: 'border-[#E0E0E0]',
      text: 'text-[#7A7A7A]',
      hover: 'hover:bg-[#ECECEC]',
    },
    danger: {
      bg: 'bg-destructive',
      border: 'border-destructive',
      text: 'text-white',
      hover: 'hover:bg-destructive',
    },
    success: {
      bg: 'bg-[#98DE8F]',
      border: 'border-[#7BC172]',
      text: 'text-white',
      hover: 'hover:bg-[#A9EFA0]',
    },
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm border-b-4',
    md: 'px-6 py-3 text-base border-b-4',
    lg: 'px-8 py-4 text-lg md:text-xl font-bold border-b-[6px]',
    icon: 'p-3 border-b-4 rounded-md',
  };

  const currentVariant = variants[variant];
  const currentSize = sizes[size] || sizes.md;
  const dangerStyle = variant === 'danger'
    ? {
        backgroundColor: 'var(--destructive, #ea3c53)',
        borderBottomColor: 'var(--destructive-dark, #c02e44)',
        color: '#ffffff',
      }
    : undefined;

  return (
    <button
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      style={dangerStyle}
      className={`
        relative 
        transition-all 
        duration-150 
        transform 
        rounded-md 
        font-extrabold 
        flex items-center justify-center gap-2
        ${currentVariant.bg} 
        ${currentVariant.border} 
        ${currentVariant.text}
        ${!disabled ? 'active:border-b-0 active:translate-y-[4px]' : 'opacity-50 cursor-not-allowed'}
        ${fullWidth ? 'w-full' : ''}
        ${currentSize}
        ${className}
      `}
    >
      {children}
    </button>
  );
};
