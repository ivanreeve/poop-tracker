import type { User } from '@supabase/supabase-js';
import type { FormEvent } from 'react';
import { STOOL_TYPES } from '../../../lib/constants';
import type { AppView, Friendship, PoopLog, Profile, StatsSummary } from '../../../types/models';
import { Dashboard } from '../dashboard/Dashboard';
import { Statistics } from '../statistics/Statistics';
import { ProfileSection } from '../profile/Profile';
import { FriendProfile } from '../profile/FriendProfile';
import { Settings } from '../settings/Settings';
import { SectionHeaderSkeleton, LogCardSkeleton } from '../../ui/skeleton';

type AppContentProps = {
  user: User | null;
  authLoading: boolean;
  authError: string | null;
  profileError: string | null;
  logsError: string | null;
  friendsError: string | null;
  view: AppView;
  greetingName: string;
  profile: Profile | null;
  stats: StatsSummary;
  userLogs: PoopLog[];
  visibleLogs: PoopLog[];
  showAllLogs: boolean;
  onToggleShowAll: () => void;
  logsLoading: boolean;
  friendLogs: PoopLog[];
  acceptedFriendsCount: number;
  friendsLoading: boolean;
  profilesById: Record<string, Profile>;
  friendEmail: string;
  onFriendEmailChange: (value: string) => void;
  onAddFriend: (event: FormEvent<HTMLFormElement>) => void;
  friendActionLoading: boolean;
  incomingRequests: Friendship[];
  outgoingRequests: Friendship[];
  acceptedFriendships: Friendship[];
  onAcceptRequest: (id: string) => void;
  onDeclineRequest: (id: string) => void;
  onSignOut: () => void;
  selectedFriendId: string | null;
  onViewFriendStats: (friendId: string) => void;
  onCloseFriendStats: () => void;
};

export const AppContent = ({
  user,
  authLoading,
  authError,
  profileError,
  logsError,
  friendsError,
  view,
  greetingName,
  profile,
  stats,
  userLogs,
  visibleLogs,
  showAllLogs,
  onToggleShowAll,
  logsLoading,
  friendLogs,
  acceptedFriendsCount,
  friendsLoading,
  profilesById,
  friendEmail,
  onFriendEmailChange,
  onAddFriend,
  friendActionLoading,
  incomingRequests,
  outgoingRequests,
  acceptedFriendships,
  onAcceptRequest,
  onDeclineRequest,
  onSignOut,
  selectedFriendId,
  onViewFriendStats,
  onCloseFriendStats,
}: AppContentProps) => {
  const hasError = authError || profileError || logsError || friendsError;

  return (
    <div className="p-4 sm:p-6 lg:p-8 xl:p-10 pb-24 lg:pb-10 space-y-6 sm:space-y-8 max-w-6xl mx-auto">
      {authLoading && (
        <div className="space-y-6 sm:space-y-8">
          <SectionHeaderSkeleton />
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white rounded-3xl p-5 sm:p-6 lg:p-8 border-2 border-gray-100 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="animate-pulse h-14 w-14 rounded-2xl bg-gray-200 border-2 border-gray-100" />
                <div className="space-y-2">
                  <div className="animate-pulse h-6 w-32 bg-gray-200 rounded" />
                  <div className="animate-pulse h-4 w-48 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          </section>
          <section>
            <div className="flex justify-between items-center mb-4">
              <div className="animate-pulse h-6 w-24 bg-gray-200 rounded" />
              <div className="animate-pulse h-4 w-16 bg-gray-200 rounded" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <LogCardSkeleton key={i} />
              ))}
            </div>
          </section>
        </div>
      )}

      {hasError && (
        <div className="bg-white/80 border-2 border-[#ead2cb] rounded-2xl p-3 sm:p-4 text-xs sm:text-sm font-bold text-[#3f0f0d]">
          {authError && <div>{authError}</div>}
          {profileError && <div>{profileError}</div>}
          {logsError && <div>{logsError}</div>}
          {friendsError && <div>{friendsError}</div>}
        </div>
      )}

      {user && view === 'dashboard' && (
        <Dashboard
          greetingName={greetingName}
          streak={stats.streak}
          userLogs={userLogs}
          visibleLogs={visibleLogs}
          showAllLogs={showAllLogs}
          onToggleShowAll={onToggleShowAll}
          logsLoading={logsLoading}
          stoolTypes={STOOL_TYPES}
          friendLogs={friendLogs}
          acceptedFriendsCount={acceptedFriendsCount}
          friendsLoading={friendsLoading}
          profilesById={profilesById}
        />
      )}

      {user && view === 'stats' && (
        <Statistics
          userLogs={userLogs}
          stoolTypes={STOOL_TYPES}
          streak={stats.streak}
          avgTypeDisplay={stats.avgTypeDisplay}
          healthScoreDisplay={stats.healthScoreDisplay}
          timePeriodStats={stats.timePeriodStats}
          averageInsightTitle={stats.averageInsightTitle}
          averageInsightSubtitle={stats.averageInsightSubtitle}
          streakInsightTitle={stats.streakInsightTitle}
          streakInsightSubtitle={stats.streakInsightSubtitle}
          bestPeriodInsightTitle={stats.bestPeriodInsightTitle}
          bestPeriodInsightSubtitle={stats.bestPeriodInsightSubtitle}
          loading={logsLoading}
        />
      )}

      {user && view === 'profile' && (
        <ProfileSection
          user={user}
          profile={profile}
          greetingName={greetingName}
          friendEmail={friendEmail}
          onFriendEmailChange={onFriendEmailChange}
          onAddFriend={onAddFriend}
          friendActionLoading={friendActionLoading}
          friendsLoading={friendsLoading}
          incomingRequests={incomingRequests}
          outgoingRequests={outgoingRequests}
          acceptedFriendships={acceptedFriendships}
          profilesById={profilesById}
          onAcceptRequest={onAcceptRequest}
          onDeclineRequest={onDeclineRequest}
          onViewFriendStats={onViewFriendStats}
        />
      )}

      {user && view === 'friend-profile' && selectedFriendId && (
        <FriendProfile
          friendProfile={profilesById[selectedFriendId]}
          friendLogs={friendLogs.filter((log) => log.user_id === selectedFriendId)}
          stoolTypes={STOOL_TYPES}
          loading={friendsLoading}
          onBack={onCloseFriendStats}
        />
      )}

      {user && view === 'settings' && (
        <Settings
          user={user}
          profile={profile}
          greetingName={greetingName}
          onSignOut={onSignOut}
        />
      )}
    </div>
  );
};
