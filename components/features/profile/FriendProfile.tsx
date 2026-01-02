import { ArrowLeft, Users } from 'lucide-react';
import type { PoopLog, Profile, StoolType } from '../../../types/models';
import { Statistics } from '../statistics/Statistics';
import { useStats } from '../../../hooks/useStats';
import { JuicyButton } from '../../ui/JuicyButton';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '../../ui/avatar';

type FriendProfileProps = {
  friendProfile: Profile | null;
  friendLogs: PoopLog[];
  stoolTypes: StoolType[];
  loading: boolean;
  onBack: () => void;
};

export const FriendProfile = ({
  friendProfile,
  friendLogs,
  stoolTypes,
  loading,
  onBack,
}: FriendProfileProps) => {
  const stats = useStats(friendLogs);
  const friendName = friendProfile?.full_name || friendProfile?.email || 'Friend';

  return (
    <>
      <div className="mb-4">
        <JuicyButton variant="coral" size="sm" onClick={onBack}>
          <ArrowLeft size={16} />
          BACK TO PROFILE
        </JuicyButton>
      </div>

      <section className="bg-white rounded-3xl p-5 sm:p-6 lg:p-8 border-2 border-gray-100 shadow-sm mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-14 w-14 rounded-2xl bg-[#F0F8FF] border-2 border-[#E8F4F3]">
            {friendProfile?.avatar_url && <AvatarImage src={friendProfile.avatar_url} alt={friendName} />}
            <AvatarFallback className="rounded-2xl bg-[#F0F8FF]">
              <Users size={24} className="text-[#A6D8D4]" />
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="text-lg sm:text-xl font-extrabold text-gray-700">{friendName}</div>
            <div className="text-xs sm:text-sm font-bold text-gray-400">{friendProfile?.email || 'Friend'}</div>
          </div>
        </div>
      </section>

      <Statistics
        userLogs={friendLogs}
        stoolTypes={stoolTypes}
        streak={stats.streak}
        avgTypeDisplay={stats.avgTypeDisplay}
        healthScoreDisplay={stats.healthScoreDisplay}
        timePeriodStats={stats.timePeriodStats}
        loading={loading}
      />
    </>
  );
};
