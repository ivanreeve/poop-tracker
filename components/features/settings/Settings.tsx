import type { User } from '@supabase/supabase-js';
import type { Profile } from '../../../types/models';
import { LogOut, User as UserIcon, Mail } from 'lucide-react';
import { JuicyButton } from '../../ui/JuicyButton';

type SettingsProps = {
  user: User;
  profile: Profile | null;
  greetingName: string;
  onSignOut: () => void;
};

export const Settings = ({ user, profile, greetingName, onSignOut }: SettingsProps) => (
  <>
    <section className="animate-fade-in">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-700 mb-2">Settings</h2>
    </section>

    <div className="grid grid-cols-1 gap-4 sm:gap-6">
      <div className="bg-white rounded-3xl p-5 sm:p-6 lg:p-8 border-2 border-gray-100 shadow-sm animate-slide-up">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-[#A6D8D4] p-2 sm:p-3 rounded-xl">
            <UserIcon size={18} className="text-white" />
          </div>
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

      <div className="bg-white rounded-3xl p-5 sm:p-6 lg:p-8 border-2 border-gray-100 shadow-sm animate-slide-up">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-[#FF8096] p-2 sm:p-3 rounded-xl">
            <LogOut size={18} className="text-white" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-gray-700">Sign Out</h3>
            <p className="text-xs sm:text-sm font-bold text-gray-400">Sign out of your account</p>
          </div>
        </div>

        <JuicyButton variant="outline" size="sm" onClick={onSignOut} fullWidth className="hover:!bg-[#FF8080] hover:!border-[#D66060] hover:!text-white cursor-pointer">
          <LogOut size={16} />
          SIGN OUT
        </JuicyButton>
      </div>
    </div>
  </>
);
