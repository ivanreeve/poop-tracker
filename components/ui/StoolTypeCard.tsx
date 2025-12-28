import { Check } from 'lucide-react';

export type StoolTypeCardProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
  emoji: string;
  delay?: number;
};

export const StoolTypeCard = ({ label, selected, onClick, emoji, delay = 0 }: StoolTypeCardProps) => (
  <div
    onClick={onClick}
    className={`
      cursor-pointer
      relative p-3 sm:p-4 rounded-2xl border-2 transition-all duration-200
      flex flex-col items-center gap-1 sm:gap-2
      ${selected
        ? 'border-[#5c1916] bg-[#f4e9e5] scale-[1.02] shadow-lg'
        : 'border-gray-200 bg-white hover:border-[#c07865] hover:-translate-y-1 hover:shadow-md shadow-sm'}
    `}
  >
    <div
      className={`text-3xl sm:text-4xl md:text-5xl filter drop-shadow-sm transition-transform duration-200 ${
        selected ? 'animate-wiggle' : ''
      }`}
    >
      {emoji}
    </div>
    <div className="text-center">
      <div className={`font-bold text-sm sm:text-base ${selected ? 'text-[#5c1916]' : 'text-gray-600'}`}>
        {label}
      </div>
    </div>
    {selected && (
      <div className="absolute top-2 right-2 bg-[#5c1916] text-white rounded-full p-1">
        <Check size={12} strokeWidth={4} />
      </div>
    )}
  </div>
);
