import { Flame, LogOut, Settings, Sparkles, User as UserIcon } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '../../types/models';
import type { AppView } from '../../types/models';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

type HeaderProps = {
  streak: number;
  user: User | null;
  profile: Profile | null;
  greetingName: string;
  onSignOut: () => void;
  onChangeView: (view: AppView) => void;
};

export const Header = ({ streak, user, profile, greetingName, onSignOut, onChangeView }: HeaderProps) => (
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Open account menu"
              className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5c1916] focus-visible:ring-offset-2 cursor-pointer"
            >
              <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border-2 border-[#3f0f0d] bg-[#5c1916]">
                {profile?.avatar_url && <AvatarImage src={profile.avatar_url} alt={greetingName} />}
                <AvatarFallback>
                  <Sparkles size={16} className="text-white" />
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={32} className="min-w-[200px] bg-white border-gray-200 shadow-none">
            <div className="flex items-center gap-3 px-2 py-3">
              <Avatar className="h-10 w-10 border border-gray-200">
                {profile?.avatar_url ? (
                  <AvatarImage src={profile.avatar_url} alt={greetingName} />
                ) : (
                  <AvatarFallback>
                    <Sparkles size={18} className="text-white" />
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex min-w-0 flex-col">
                <span className="text-sm font-semibold leading-tight text-gray-700">
                  {greetingName}
                </span>
                <span className="text-xs text-gray-500 truncate">
                  {user.email}
                </span>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onChangeView('profile')} className="hover:bg-gray-100 cursor-pointer">
              <UserIcon className="h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onChangeView('settings')} className="hover:bg-gray-100 cursor-pointer">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onSignOut}
              className="text-red-500 focus:text-red-500 data-[variant=destructive]:text-red-500 hover:bg-red-50 cursor-pointer"
            >
              <LogOut className="h-4 w-4 text-red-500" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </div>
  </header>
);
