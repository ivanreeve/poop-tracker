import { useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { Flame, LogIn, LogOut, Settings, Sparkles, User as UserIcon } from 'lucide-react';
import type { Profile } from '../../types/models';
import type { AppView } from '../../types/models';
import { Avatar } from '../ui/Avatar';

type HeaderProps = {
  streak: number;
  user: User | null;
  profile: Profile | null;
  greetingName: string;
  onSignIn: () => void;
  onSignOut: () => void;
  onChangeView: (view: AppView) => void;
};

export const Header = ({ streak, user, profile, greetingName, onSignIn, onSignOut, onChangeView }: HeaderProps) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <header className="lg:hidden px-4 sm:px-6 py-4 flex justify-between items-center bg-white/80 backdrop-blur-lg border-b border-gray-100 z-10 sticky top-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="bg-[#FF8096] p-2 sm:p-2.5 rounded-xl animate-float">
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
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="bg-[#FF8096] w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-[#D65D73] flex items-center justify-center overflow-hidden"
                aria-label="Account menu"
              >
                <Avatar
                  src={profile?.avatar_url}
                  alt={greetingName}
                  fallback={<Sparkles size={16} className="text-white" />}
                  className="w-full h-full flex items-center justify-center"
                  imgClassName="w-full h-full object-cover"
                />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onChangeView('profile');
                    }}
                    className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors"
                  >
                    <UserIcon size={18} className="text-gray-500" />
                    <span className="text-sm font-semibold text-gray-700">Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onChangeView('settings');
                    }}
                    className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors"
                  >
                    <Settings size={18} className="text-gray-500" />
                    <span className="text-sm font-semibold text-gray-700">Settings</span>
                  </button>
                  <div className="border-t border-gray-100 my-2" />
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onSignOut();
                    }}
                    className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={18} className="text-red-500" />
                    <span className="text-sm font-semibold text-red-500">Sign out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onSignIn}
              className="bg-[#A6D8D4] w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-[#7CB2AE] flex items-center justify-center"
              aria-label="Sign in with Google"
            >
              <LogIn size={16} className="text-white" />
            </button>
          )}
        </div>
      </header>
      {showMenu && (
        <div
          className="lg:hidden fixed inset-0 z-40"
          onClick={() => setShowMenu(false)}
        />
      )}
    </>
  );
};
