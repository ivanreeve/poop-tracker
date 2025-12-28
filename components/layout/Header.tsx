import { Flame } from 'lucide-react';

type HeaderProps = {
  streak: number;
};

export const Header = ({ streak }: HeaderProps) => (
  <header className="lg:hidden px-4 sm:px-6 py-4 flex justify-between items-center bg-white/80 backdrop-blur-lg border-b border-gray-100 z-10 sticky top-0">
    <div className="flex items-center gap-2 sm:gap-3">
      <div className="bg-[#5c1916] p-2 sm:p-2.5 rounded-xl">
        <span className="text-lg sm:text-xl">💩</span>
      </div>
      <h1 className="text-lg sm:text-xl font-extrabold text-gray-700 tracking-tight">PoopPal</h1>
    </div>
    <div className="flex items-center gap-3 sm:gap-4">
      <div className="flex items-center gap-1">
        <Flame className="text-orange-400 fill-orange-400" size={18} />
        <span className="font-extrabold text-orange-400">{streak}</span>
      </div>
    </div>
  </header>
);
