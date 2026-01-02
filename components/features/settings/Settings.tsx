import type { User } from '@supabase/supabase-js';
import type { Profile } from '../../../types/models';
import { LogOut, Mail } from 'lucide-react';
import { JuicyButton } from '../../ui/JuicyButton';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';

type SettingsProps = {
  user: User;
  profile: Profile | null;
  greetingName: string;
  onSignOut: () => void;
};

export const Settings = ({ user, profile, greetingName, onSignOut }: SettingsProps) => {
  const avatarInitial = greetingName?.trim()?.charAt(0)?.toUpperCase()
    || user.email?.trim()?.charAt(0)?.toUpperCase()
    || 'U';

  return (
    <>
      <section>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-700 mb-2">Settings</h2>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        <div className="bg-white rounded-3xl p-5 sm:p-6 lg:p-8 border-2 border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <Avatar className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-[#A6D8D4]">
              {profile?.avatar_url && <AvatarImage src={profile.avatar_url} alt={greetingName} />}
              <AvatarFallback className="rounded-full bg-[#A6D8D4] text-white text-sm font-bold">
                {avatarInitial}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-gray-700">Account</h3>
              <p className="text-xs sm:text-sm font-bold text-gray-400">Manage your account settings</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-400 block mb-1">Display Name</label>
              <div className="text-sm sm:text-base font-semibold text-gray-700">{greetingName}</div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 block mb-1">Email</label>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-gray-400" />
                <div className="text-sm sm:text-base font-semibold text-gray-700 truncate">{user.email}</div>
              </div>
            </div>
          </div>
        </div>

      <div className="bg-white rounded-3xl p-5 sm:p-6 lg:p-8 border-2 border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-[#5c1916] p-2 sm:p-3 rounded-xl">
            <LogOut size={18} className="text-white" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-gray-700">Sign Out</h3>
            <p className="text-xs sm:text-sm font-bold text-gray-400">Sign out of your account</p>
          </div>
        </div>

        <JuicyButton variant="danger" size="sm" onClick={onSignOut} fullWidth className="cursor-pointer">
          <LogOut size={16} />
          SIGN OUT
        </JuicyButton>
      </div>
      </div>
    </>
  );
};
