import type { User } from '@supabase/supabase-js';
import { BarChart2, ChevronRight, Droplets, Plus, Settings, Users } from 'lucide-react';
import type { AppView } from '../../types/models';
import { JuicyButton } from '../ui/JuicyButton';

type SidebarProps = {
  user: User | null;
  view: AppView;
  onChangeView: (view: AppView) => void;
  onOpenLogging: () => void;
};

export const Sidebar = ({
  user,
  view,
  onChangeView,
  onOpenLogging,
}: SidebarProps) => (
  <aside className="hidden lg:flex lg:w-72 xl:w-80 bg-white border-r-2 border-gray-100 flex-col fixed h-full z-20">
    <div className="px-6 py-6 flex items-center gap-3 border-b border-gray-100">
      <div className="bg-[#FF8096] p-3 rounded-xl">
        <span className="text-2xl">💩</span>
      </div>
      <div>
        <h1 className="text-2xl font-extrabold text-gray-700 tracking-tight">PoopPal</h1>
        <p className="text-xs font-bold text-gray-400">Track your health</p>
      </div>
    </div>

    <div className="p-4">
      <JuicyButton variant="primary" size="md" fullWidth onClick={onOpenLogging} disabled={!user}>
        <Plus size={20} />
        {user ? 'ADD NEW' : 'SIGN IN TO LOG'}
      </JuicyButton>
    </div>

    <nav className="flex-1 p-4 space-y-2">
      {[
        { id: 'dashboard', icon: Droplets, label: 'Dashboard' },
        { id: 'stats', icon: BarChart2, label: 'Statistics' },
        { id: 'profile', icon: Users, label: 'Friends' },
        { id: 'settings', icon: Settings, label: 'Settings' },
      ].map((item, index) => (
        <button
          key={item.id}
          onClick={() => onChangeView(item.id as AppView)}
          className={`
            cursor-pointer w-full flex items-center gap-4 p-4 rounded-md transition-all duration-200
            ${view === item.id ? 'bg-[#FFF0F3] text-[#FF8096]' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}
          `}
        >
          <item.icon size={24} strokeWidth={2.5} className={view === item.id ? 'text-[#FF8096]' : ''} />
          <span className="font-bold">{item.label}</span>
          {view === item.id && <ChevronRight size={18} className="ml-auto text-[#FF8096]" />}
        </button>
      ))}
    </nav>
  </aside>
);
