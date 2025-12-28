import { Flame, Sparkles } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '../../types/models';
import type { AppView } from '../../types/models';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '../ui/avatar';

type HeaderProps = {
  streak: number;
  user: User | null;
  profile: Profile | null;
  greetingName: string;
  onChangeView: (view: AppView) => void;
};

export const Header = ({ streak, user, profile, greetingName, onChangeView }: HeaderProps) => (
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
      {user ? (
        <button
          type="button"
          aria-label="Open settings"
          onClick={() => onChangeView('settings')}
          className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5c1916] focus-visible:ring-offset-2 cursor-pointer"
        >
          <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border-2 border-[#3f0f0d] bg-[#5c1916]">
            {profile?.avatar_url && <AvatarImage src={profile.avatar_url} alt={greetingName} />}
            <AvatarFallback>
              <Sparkles size={16} className="text-white" />
            </AvatarFallback>
          </Avatar>
        </button>
      ) : null}
    </div>
  </header>
);
