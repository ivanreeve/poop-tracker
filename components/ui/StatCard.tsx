import React from 'react';

export type StatCardProps = {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  value: string | number;
  label: string;
  accentColor: string;
  delay?: number;
};

const toRgba = (hex: string, alpha: number) => {
  const normalized = hex.replace('#', '').trim();
  const full = normalized.length === 3
    ? normalized.split('').map((c) => c + c).join('')
    : normalized;
  if (full.length !== 6) return `rgba(0, 0, 0, ${alpha})`;
  const r = Number.parseInt(full.slice(0, 2), 16);
  const g = Number.parseInt(full.slice(2, 4), 16);
  const b = Number.parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const StatCard = ({ icon: Icon, value, label, accentColor, delay = 0 }: StatCardProps) => (
  <div
    style={{
      animationDelay: `${delay}ms`,
      borderColor: accentColor,
      backgroundColor: toRgba(accentColor, 0.14),
    }}
    className="rounded-md p-3 sm:p-4 md:p-5 border-2 flex items-center gap-3 sm:gap-4"
  >
    <Icon size={32} className="sm:w-9 sm:h-9" style={{ color: accentColor }} />
    <div>
      <div className="text-xl sm:text-2xl md:text-3xl font-black" style={{ color: accentColor }}>
        {value}
      </div>
      <div
        className="text-xs sm:text-sm font-bold uppercase tracking-wide"
        style={{ color: toRgba(accentColor, 0.65) }}
      >
        {label}
      </div>
    </div>
  </div>
);
