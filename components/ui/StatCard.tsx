import React from 'react';

export type StatCardProps = {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  value: string | number;
  label: string;
  color: string;
  delay?: number;
};

export const StatCard = ({ icon: Icon, value, label, color, delay = 0 }: StatCardProps) => (
  <div
    style={{ animationDelay: `${delay}ms` }}
    className="bg-white rounded-2xl p-3 sm:p-4 md:p-5 border-2 border-gray-100 shadow-sm flex items-center gap-3 sm:gap-4 card-hover"
  >
    <div className={`p-2 sm:p-3 rounded-xl ${color} transition-transform duration-300 hover:rotate-12`}>
      <Icon size={20} className="text-white sm:w-6 sm:h-6" />
    </div>
    <div>
      <div className="text-xl sm:text-2xl md:text-3xl font-black text-gray-700">{value}</div>
      <div className="text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-wide">{label}</div>
    </div>
  </div>
);
