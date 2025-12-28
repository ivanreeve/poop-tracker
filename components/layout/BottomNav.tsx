import { BarChart2, Droplets, Plus, Settings, Users } from 'lucide-react';
import type { AppView } from '../../types/models';

type BottomNavProps = {
  view: AppView;
  onChangeView: (view: AppView) => void;
  onOpenLogging: () => void;
};

export const BottomNav = ({ view, onChangeView, onOpenLogging }: BottomNavProps) => (
  <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t-2 border-gray-100 px-2 py-2 flex items-center gap-1 z-20 pb-safe">
    {[
      { id: 'dashboard', icon: Droplets, label: 'Track' },
      { id: 'stats', icon: BarChart2, label: 'Stats' },
    ].map((item) => (
      <button
        key={item.id}
        onClick={() => onChangeView(item.id as AppView)}
        className={`
          flex-1 flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl transition-all duration-200 mb-2
          ${view === item.id ? 'bg-[#f4e9e5]' : 'bg-transparent'}
        `}
      >
        <item.icon
          size={24}
          strokeWidth={2.5}
          className={`transition-all duration-200 ${view === item.id ? 'text-[#5c1916] scale-110' : 'text-gray-400'}`}
        />
        <span className={`text-[10px] sm:text-xs font-bold mt-1 ${view === item.id ? 'text-[#5c1916]' : 'text-gray-400'}`}>
          {item.label}
        </span>
      </button>
    ))}

    <button
      onClick={onOpenLogging}
      className="absolute left-1/2 -translate-x-1/2 -top-7 flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#5c1916] text-white border-b-4 border-[#3f0f0d] shadow-lg transition-all duration-150 active:border-b-0 active:translate-y-[4px] hover:scale-[1.03] z-30 cursor-pointer"
    >
      <Plus size={26} strokeWidth={3} />
    </button>

    <button
      onClick={() => onChangeView('profile')}
      className={`
        flex-1 flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl transition-all duration-200 mb-2
        ${view === 'profile' ? 'bg-[#f4e9e5]' : 'bg-transparent'}
      `}
    >
      <Users
        size={24}
        strokeWidth={2.5}
        className={`transition-all duration-200 ${view === 'profile' ? 'text-[#5c1916] scale-110' : 'text-gray-400'}`}
      />
      <span className={`text-[10px] sm:text-xs font-bold mt-1 ${view === 'profile' ? 'text-[#5c1916]' : 'text-gray-400'}`}>
        Friends
      </span>
    </button>
    <button
      onClick={() => onChangeView('settings')}
      className={`
        flex-1 flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl transition-all duration-200 mb-2
        ${view === 'settings' ? 'bg-[#f4e9e5]' : 'bg-transparent'}
      `}
    >
      <Settings
        size={24}
        strokeWidth={2.5}
        className={`transition-all duration-200 ${view === 'settings' ? 'text-[#5c1916] scale-110' : 'text-gray-400'}`}
      />
      <span className={`text-[10px] sm:text-xs font-bold mt-1 ${view === 'settings' ? 'text-[#5c1916]' : 'text-gray-400'}`}>
        Settings
      </span>
    </button>
  </nav>
);
