import type { User } from '@supabase/supabase-js';
import { BarChart2, ChevronRight, Droplets, Loader2, LogIn, LogOut, Plus, Settings, Sparkles, Users } from 'lucide-react';
import type { AppView, Profile } from '../../types/models';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '../ui/avatar';
import { JuicyButton } from '../ui/JuicyButton';

type SidebarProps = {
  user: User | null;
  profile: Profile | null;
  greetingName: string;
  authLoading: boolean;
  view: AppView;
  onChangeView: (view: AppView) => void;
  onOpenLogging: () => void;
  onSignIn: () => void;
  onSignOut: () => void;
};

export const Sidebar = ({
  user,
  profile,
  greetingName,
  authLoading,
  view,
  onChangeView,
  onOpenLogging,
  onSignIn,
  onSignOut,
}: SidebarProps) => (
  <aside className="hidden lg:flex lg:w-72 xl:w-80 bg-white border-r-2 border-gray-100 flex-col fixed h-full z-20">
    <div className="px-6 py-6 flex items-center gap-3 border-b border-gray-100">
      <div className="bg-[#FF8096] p-3 rounded-xl animate-float">
        <span className="text-2xl">💩</span>
      </div>
      <div>
        <h1 className="text-2xl font-extrabold text-gray-700 tracking-tight">PoopPal</h1>
        <p className="text-xs font-bold text-gray-400">Track your health</p>
      </div>
    </div>

    <div className="px-6 py-4 border-b border-gray-100">
      {user ? (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 rounded-xl bg-[#FFF0F3] border-2 border-[#FFE8EC]">
            {profile?.avatar_url && <AvatarImage src={profile.avatar_url} alt={greetingName} />}
            <AvatarFallback className="rounded-xl bg-[#FFF0F3]">
              <Users size={18} className="text-[#FF8096]" />
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="font-bold text-sm text-gray-700 truncate">{greetingName}</div>
            <div className="text-[10px] font-bold text-gray-400 truncate">{user.email}</div>
          </div>
          <button
            onClick={onSignOut}
            className="p-2 rounded-xl border border-gray-100 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
            aria-label="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      ) : (
        <JuicyButton variant="secondary" size="sm" fullWidth onClick={onSignIn} disabled={authLoading}>
          {authLoading ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
          {authLoading ? 'CHECKING...' : 'SIGN IN WITH GOOGLE'}
        </JuicyButton>
      )}
    </div>

    <div className="p-4">
      <JuicyButton variant="primary" size="md" fullWidth onClick={onOpenLogging} disabled={!user}>
        <Plus size={20} />
        {user ? 'LOG NOW' : 'SIGN IN TO LOG'}
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
          style={{ animationDelay: `${index * 100}ms` }}
          className={`
            cursor-pointer w-full flex items-center gap-4 p-4 rounded-md transition-all duration-200 animate-slide-up
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
