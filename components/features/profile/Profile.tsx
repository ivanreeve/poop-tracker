import React from 'react';
import type { User } from '@supabase/supabase-js';
import { BarChart, Loader2, Mail, UserPlus, Users } from 'lucide-react';
import type { Friendship, Profile } from '../../../types/models';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '../../ui/avatar';
import { JuicyButton } from '../../ui/JuicyButton';
import { FriendCardSkeleton } from '../../ui/skeleton';

type ProfileSectionProps = {
  user: User;
  profile: Profile | null;
  greetingName: string;
  friendEmail: string;
  onFriendEmailChange: (value: string) => void;
  onAddFriend: (event: React.FormEvent<HTMLFormElement>) => void;
  friendActionLoading: boolean;
  friendsLoading: boolean;
  incomingRequests: Friendship[];
  outgoingRequests: Friendship[];
  acceptedFriendships: Friendship[];
  profilesById: Record<string, Profile>;
  onAcceptRequest: (id: string) => void;
  onDeclineRequest: (id: string) => void;
  onViewFriendStats: (friendId: string) => void;
};

export const ProfileSection = ({
  user,
  profile,
  greetingName,
  friendEmail,
  onFriendEmailChange,
  onAddFriend,
  friendActionLoading,
  friendsLoading,
  incomingRequests,
  outgoingRequests,
  acceptedFriendships,
  profilesById,
  onAcceptRequest,
  onDeclineRequest,
  onViewFriendStats,
}: ProfileSectionProps) => (
  <>
    <section>
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-700 mb-2">Profile & Friends</h2>
    </section>

    <section className="grid grid-cols-1 gap-4 sm:gap-6">
      <div className="bg-white rounded-3xl p-5 sm:p-6 lg:p-8 border-2 border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Users size={18} className="text-[var(--flo-pink)]" />
          <h3 className="text-base sm:text-lg font-extrabold text-gray-700">Your Friends</h3>
        </div>
        {friendsLoading ? (
          <div className="space-y-3">
            <FriendCardSkeleton />
            <FriendCardSkeleton />
            <FriendCardSkeleton />
          </div>
        ) : (
          <>
            {acceptedFriendships.length === 0 ? (
              <div className="text-xs sm:text-sm font-bold text-gray-400">
                No friends yet. Add someone to start sharing logs.
              </div>
            ) : (
              <div className="space-y-3">
                {acceptedFriendships.map((friendship) => {
                  const friendId = friendship.user_id === user.id ? friendship.friend_id : friendship.user_id;
                  const friendProfile = profilesById[friendId];
                  const friendName = friendProfile?.full_name || friendProfile?.email || 'Friend';
                  return (
                    <div
                      key={friendship.id}
                      className="flex items-center justify-between gap-3 bg-[rgba(92,25,22,0.08)] border-2 border-[var(--flo-pink)]/10 rounded-md p-3"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 rounded-full bg-white">
                          {friendProfile?.avatar_url && <AvatarImage src={friendProfile.avatar_url} alt={friendName} />}
                          <AvatarFallback className="rounded-full bg-white">
                            <Users size={16} className="text-flo-pink" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-bold text-sm text-gray-700">{friendName}</div>
                          <div className="text-[10px] font-bold text-gray-400">{friendProfile?.email}</div>
                        </div>
                      </div>
                      <JuicyButton
                        variant="pink"
                        size="sm"
                        onClick={() => onViewFriendStats(friendId)}
                      >
                        <BarChart size={14} />
                        VIEW
                      </JuicyButton>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      <div className="bg-white rounded-3xl p-5 sm:p-6 lg:p-8 border-2 border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Users size={18} className="text-[#5c1916]" />
          <h3 className="text-base sm:text-lg font-extrabold text-gray-700">Friend Requests</h3>
        </div>
        {friendsLoading ? (
          <div className="space-y-3">
            <FriendCardSkeleton />
            <FriendCardSkeleton />
          </div>
        ) : (
          <>
            {incomingRequests.length === 0 && outgoingRequests.length === 0 ? (
              <div className="text-xs sm:text-sm font-bold text-gray-400">No pending requests right now.</div>
            ) : (
              <div className="space-y-3">
                {incomingRequests.map((request) => {
                  const requesterProfile = profilesById[request.user_id];
                  const requesterName = requesterProfile?.full_name || requesterProfile?.email || 'Friend';
                  return (
                    <div
                      key={request.id}
                      className="flex flex-wrap items-center justify-between gap-3 bg-[#fcf6f4] border-2 border-[#ead2cb] rounded-2xl p-3"
                    >
                      <div>
                        <div className="font-bold text-sm text-gray-700">{requesterName}</div>
                        <div className="text-[10px] font-bold text-gray-400">{requesterProfile?.email}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <JuicyButton
                          variant="success"
                          size="sm"
                          onClick={() => onAcceptRequest(request.id)}
                          disabled={friendActionLoading}
                        >
                          ACCEPT
                        </JuicyButton>
                        <JuicyButton
                          variant="outline"
                          size="sm"
                          onClick={() => onDeclineRequest(request.id)}
                          disabled={friendActionLoading}
                        >
                          DECLINE
                        </JuicyButton>
                      </div>
                    </div>
                  );
                })}
                {outgoingRequests.map((request) => {
                  const friendProfile = profilesById[request.friend_id];
                  const friendName = friendProfile?.full_name || friendProfile?.email || 'Friend';
                  return (
                    <div
                      key={request.id}
                      className="flex items-center justify-between gap-3 bg-white border-2 border-gray-100 rounded-2xl p-3"
                    >
                      <div>
                        <div className="font-bold text-sm text-gray-700">{friendName}</div>
                        <div className="text-[10px] font-bold text-gray-400">{friendProfile?.email}</div>
                      </div>
                      <div className="text-[10px] sm:text-xs font-bold text-gray-400">REQUEST SENT</div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      <div className="bg-white rounded-3xl p-5 sm:p-6 lg:p-8 border-2 border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-gray-700">Add a friend</h3>
            <p className="text-xs sm:text-sm font-bold text-gray-400">Invite by email to share logs.</p>
          </div>
        </div>
        <form onSubmit={onAddFriend} className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--flo-teal)]" />
            <input
              type="email"
              placeholder="friend@example.com"
              value={friendEmail}
              onChange={(event) => onFriendEmailChange(event.target.value)}
              className="w-full rounded-md border-2 border-gray-100 bg-[rgba(166,216,212,0.2)] px-9 py-2 text-sm font-bold text-[var(--flo-teal)] placeholder:text-[var(--flo-teal)] focus:outline-none focus:border-[#A6D8D4]"
            />
          </div>
          <JuicyButton variant="teal" size="sm" disabled={!friendEmail || friendActionLoading}>
            {friendActionLoading ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
            SEND FRIEND REQUEST
          </JuicyButton>
        </form>
      </div>
    </section>
  </>
);
