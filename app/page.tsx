"use client"

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { Loader2, LogIn } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { STOOL_TYPES } from '../lib/constants';
import {
  calculateAvgType,
  calculateHealthScore,
  calculateStreak,
  calculateTimePeriodStats,
  getBestPeriod,
} from '../lib/calculations';
import type { AppView, Friendship, PoopLog, Profile } from '../types/models';
import { BottomNav } from '../components/layout/BottomNav';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { Dashboard } from '../components/features/dashboard/Dashboard';
import { Statistics } from '../components/features/statistics/Statistics';
import { ProfileSection } from '../components/features/profile/Profile';
import { LogModal } from '../components/features/logging/LogModal';
import { JuicyButton } from '../components/ui/JuicyButton';

export default function App() {
  const [view, setView] = useState<AppView>('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [dataError, setDataError] = useState<string | null>(null);

  const [userLogs, setUserLogs] = useState<PoopLog[]>([]);
  const [friendLogs, setFriendLogs] = useState<PoopLog[]>([]);
  const [friendships, setFriendships] = useState<Friendship[]>([]);
  const [profilesById, setProfilesById] = useState<Record<string, Profile>>({});
  const [logsLoading, setLogsLoading] = useState(false);
  const [friendsLoading, setFriendsLoading] = useState(false);

  const [showAllLogs, setShowAllLogs] = useState(false);
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [isLogging, setIsLogging] = useState(false);
  const [isSavingLog, setIsSavingLog] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [friendEmail, setFriendEmail] = useState('');
  const [friendActionLoading, setFriendActionLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      setUser(data.session?.user ?? null);
      setAuthLoading(false);
      if (error) {
        setAuthError(error.message);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return;
      setUser(nextSession?.user ?? null);
    });

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isLogging) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsLogging(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLogging]);

  const ensureProfile = useCallback(async (currentUser: User) => {
    const metadata = currentUser.user_metadata ?? {};
    const fullName =
      metadata.full_name ||
      metadata.name ||
      metadata.preferred_username ||
      currentUser.email?.split('@')[0] ||
      'Friend';
    const avatarUrl = metadata.avatar_url || metadata.picture || null;

    const { data, error } = await supabase
      .from('profiles')
      .upsert(
        {
          id: currentUser.id,
          email: currentUser.email,
          full_name: fullName,
          avatar_url: avatarUrl,
        },
        { onConflict: 'id' }
      )
      .select()
      .single();

    if (error) {
      setDataError(error.message);
      return null;
    }

    setProfile(data);
    setProfilesById((prev) => ({ ...prev, [data.id]: data }));
    return data;
  }, []);

  const loadUserLogs = useCallback(async (currentUserId: string) => {
    setLogsLoading(true);
    const { data, error } = await supabase
      .from('poop_logs')
      .select('*')
      .eq('user_id', currentUserId)
      .order('occurred_at', { ascending: false });

    if (error) {
      setDataError(error.message);
      setLogsLoading(false);
      return;
    }

    setUserLogs(data ?? []);
    setLogsLoading(false);
  }, []);

  const loadFriends = useCallback(async (currentUserId: string) => {
    setFriendsLoading(true);
    const { data: friendshipsData, error: friendshipsError } = await supabase
      .from('friendships')
      .select('*')
      .or(`user_id.eq.${currentUserId},friend_id.eq.${currentUserId}`);

    if (friendshipsError) {
      setDataError(friendshipsError.message);
      setFriendsLoading(false);
      return;
    }

    const updatedFriendships = friendshipsData ?? [];
    setFriendships(updatedFriendships);

    const accepted = updatedFriendships.filter((friendship) => friendship.status === 'accepted');
    const allFriendIds = Array.from(
      new Set(
        updatedFriendships.map((friendship) =>
          friendship.user_id === currentUserId ? friendship.friend_id : friendship.user_id
        )
      )
    );
    const acceptedFriendIds = accepted.map((friendship) =>
      friendship.user_id === currentUserId ? friendship.friend_id : friendship.user_id
    );

    if (allFriendIds.length === 0) {
      setFriendLogs([]);
      setFriendsLoading(false);
      return;
    }

    const { data: friendProfiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, full_name, avatar_url')
      .in('id', allFriendIds);

    if (profileError) {
      setDataError(profileError.message);
    }

    if (friendProfiles) {
      const profileMap = friendProfiles.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {} as Record<string, Profile>);
      setProfilesById((prev) => ({ ...prev, ...profileMap }));
    }

    if (acceptedFriendIds.length > 0) {
      const { data: logsData, error: logsError } = await supabase
        .from('poop_logs')
        .select('*')
        .in('user_id', acceptedFriendIds)
        .order('occurred_at', { ascending: false });

      if (logsError) {
        setDataError(logsError.message);
      }

      setFriendLogs(logsData ?? []);
    } else {
      setFriendLogs([]);
    }

    setFriendsLoading(false);
  }, []);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setUserLogs([]);
      setFriendLogs([]);
      setFriendships([]);
      setProfilesById({});
      setIsLogging(false);
      setSelectedType(null);
      return;
    }

    const loadAccount = async () => {
      setDataError(null);
      await ensureProfile(user);
      await Promise.all([loadUserLogs(user.id), loadFriends(user.id)]);
    };

    void loadAccount();
  }, [user, ensureProfile, loadUserLogs, loadFriends]);

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) {
      setAuthError(error.message);
    }
  };

  const handleSignOut = async () => {
    setAuthError(null);
    await supabase.auth.signOut();
  };

  const openLogging = () => {
    if (!user) {
      setAuthError('Sign in to log your entries.');
      setView('profile');
      return;
    }
    setIsLogging(true);
  };

  const handleLog = async () => {
    if (!selectedType || !user) return;
    setIsSavingLog(true);
    setDataError(null);
    const { data, error } = await supabase
      .from('poop_logs')
      .insert({
        user_id: user.id,
        type: selectedType,
        notes: '',
        occurred_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      setDataError(error.message);
      setIsSavingLog(false);
      return;
    }

    setUserLogs((prev) => [data, ...prev]);
    setIsLogging(false);
    setSelectedType(null);
    setIsSavingLog(false);
  };

  const handleAddFriend = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    const email = friendEmail.trim().toLowerCase();
    if (!email) return;
    if (email === user.email?.toLowerCase()) {
      setDataError('You cannot add yourself.');
      return;
    }

    setFriendActionLoading(true);
    setDataError(null);

    const { data: friendProfile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, full_name, avatar_url')
      .ilike('email', email)
      .maybeSingle();

    if (profileError) {
      setDataError(profileError.message);
      setFriendActionLoading(false);
      return;
    }

    if (!friendProfile) {
      setDataError('No user found with that email.');
      setFriendActionLoading(false);
      return;
    }

    const existingFriendship = friendships.some((friendship) => {
      const isDirect = friendship.user_id === user.id && friendship.friend_id === friendProfile.id;
      const isReverse = friendship.user_id === friendProfile.id && friendship.friend_id === user.id;
      return isDirect || isReverse;
    });

    if (existingFriendship) {
      setDataError('You already have a pending or accepted request with this user.');
      setFriendActionLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from('friendships').insert({
      user_id: user.id,
      friend_id: friendProfile.id,
      status: 'pending',
    });

    if (insertError) {
      setDataError(insertError.message);
      setFriendActionLoading(false);
      return;
    }

    setFriendEmail('');
    await loadFriends(user.id);
    setFriendActionLoading(false);
  };

  const handleAcceptRequest = async (requestId: string) => {
    if (!user) return;
    setFriendActionLoading(true);
    setDataError(null);
    const { error } = await supabase.from('friendships').update({ status: 'accepted' }).eq('id', requestId);

    if (error) {
      setDataError(error.message);
      setFriendActionLoading(false);
      return;
    }

    await loadFriends(user.id);
    setFriendActionLoading(false);
  };

  const handleDeclineRequest = async (requestId: string) => {
    if (!user) return;
    setFriendActionLoading(true);
    setDataError(null);
    const { error } = await supabase.from('friendships').delete().eq('id', requestId);

    if (error) {
      setDataError(error.message);
      setFriendActionLoading(false);
      return;
    }

    await loadFriends(user.id);
    setFriendActionLoading(false);
  };

  const streak = useMemo(() => calculateStreak(userLogs), [userLogs]);
  const visibleLogs = showAllLogs ? userLogs : userLogs.slice(0, 4);

  const avgType = useMemo(() => calculateAvgType(userLogs), [userLogs]);
  const avgTypeDisplay = avgType ? avgType.toFixed(1) : '0';

  const timePeriodStats = useMemo(() => calculateTimePeriodStats(userLogs), [userLogs]);
  const bestPeriod = useMemo(() => getBestPeriod(timePeriodStats), [timePeriodStats]);

  const healthScore = useMemo(
    () => calculateHealthScore(avgType, streak, userLogs.length),
    [avgType, streak, userLogs.length]
  );
  const healthScoreDisplay = userLogs.length ? Math.round(healthScore).toString() : '0';

  const averageInsightTitle = avgType ? `Avg type ${avgType.toFixed(1)}` : 'No average yet';
  const averageInsightSubtitle = avgType
    ? 'Ideal is around 4.0 on the Bristol scale.'
    : 'Log a few entries to see your average.';
  const streakInsightTitle = userLogs.length ? `Streak: ${streak} day${streak === 1 ? '' : 's'}` : 'No streak yet';
  const streakInsightSubtitle = userLogs.length ? 'Keep logging daily to build consistency.' : 'Log today to start a streak.';
  const bestPeriodLabel = bestPeriod && bestPeriod.count > 0 ? bestPeriod.label : null;
  const bestPeriodInsightTitle = bestPeriodLabel ? `Top time: ${bestPeriodLabel}` : 'No time pattern yet';
  const bestPeriodInsightSubtitle = bestPeriodLabel
    ? `${bestPeriod.count} logs during the ${bestPeriodLabel.toLowerCase()}.`
    : 'Add more logs to reveal a pattern.';

  const acceptedFriendships = useMemo(
    () => friendships.filter((friendship) => friendship.status === 'accepted'),
    [friendships]
  );
  const incomingRequests = useMemo(
    () => friendships.filter((friendship) => friendship.status === 'pending' && friendship.friend_id === user?.id),
    [friendships, user?.id]
  );
  const outgoingRequests = useMemo(
    () => friendships.filter((friendship) => friendship.status === 'pending' && friendship.user_id === user?.id),
    [friendships, user?.id]
  );

  const greetingName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'Friend';

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-flo font-sans text-slate-800">
      <div className="w-full min-h-screen flex flex-col lg:flex-row">
        <Sidebar
          user={user}
          profile={profile}
          greetingName={greetingName}
          authLoading={authLoading}
          view={view}
          onChangeView={setView}
          onOpenLogging={openLogging}
          onSignIn={handleGoogleSignIn}
          onSignOut={handleSignOut}
        />

        <main className="flex-1 lg:ml-72 xl:ml-80">
          <Header
            streak={streak}
            user={user}
            profile={profile}
            greetingName={greetingName}
            onSignIn={handleGoogleSignIn}
            onOpenProfile={() => setView('profile')}
          />

          <div className="p-4 sm:p-6 lg:p-8 xl:p-10 pb-24 lg:pb-10 space-y-6 sm:space-y-8 max-w-6xl mx-auto">
            {authLoading && (
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-400">
                <Loader2 size={16} className="animate-spin" />
                Checking your session...
              </div>
            )}

            {(authError || dataError) && (
              <div className="bg-white/80 border-2 border-[#FFE8EC] rounded-2xl p-3 sm:p-4 text-xs sm:text-sm font-bold text-[#D65D73] animate-slide-up">
                {authError && <div>{authError}</div>}
                {dataError && <div>{dataError}</div>}
              </div>
            )}

            {!user && !authLoading && (
              <section className="bg-white rounded-3xl p-5 sm:p-6 lg:p-8 border-2 border-gray-100 shadow-sm animate-slide-up">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-[#A6D8D4] p-2 sm:p-3 rounded-xl">
                    <LogIn size={20} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-gray-700">Sign in to start tracking</h2>
                    <p className="text-xs sm:text-sm font-bold text-gray-400">
                      Google login unlocks logging and friend sharing.
                    </p>
                  </div>
                </div>
                <JuicyButton variant="secondary" size="md" onClick={handleGoogleSignIn} disabled={authLoading}>
                  <LogIn size={18} />
                  CONTINUE WITH GOOGLE
                </JuicyButton>
              </section>
            )}

            {user && view === 'dashboard' && (
              <Dashboard
                greetingName={greetingName}
                streak={streak}
                userLogs={userLogs}
                visibleLogs={visibleLogs}
                showAllLogs={showAllLogs}
                onToggleShowAll={() => setShowAllLogs((prev) => !prev)}
                logsLoading={logsLoading}
                stoolTypes={STOOL_TYPES}
                friendLogs={friendLogs}
                acceptedFriendsCount={acceptedFriendships.length}
                friendsLoading={friendsLoading}
                profilesById={profilesById}
              />
            )}

            {user && view === 'stats' && (
              <Statistics
                userLogs={userLogs}
                stoolTypes={STOOL_TYPES}
                streak={streak}
                avgTypeDisplay={avgTypeDisplay}
                healthScoreDisplay={healthScoreDisplay}
                timePeriodStats={timePeriodStats}
                averageInsightTitle={averageInsightTitle}
                averageInsightSubtitle={averageInsightSubtitle}
                streakInsightTitle={streakInsightTitle}
                streakInsightSubtitle={streakInsightSubtitle}
                bestPeriodInsightTitle={bestPeriodInsightTitle}
                bestPeriodInsightSubtitle={bestPeriodInsightSubtitle}
              />
            )}

            {user && view === 'profile' && (
              <ProfileSection
                user={user}
                profile={profile}
                greetingName={greetingName}
                friendEmail={friendEmail}
                onFriendEmailChange={setFriendEmail}
                onAddFriend={handleAddFriend}
                friendActionLoading={friendActionLoading}
                friendsLoading={friendsLoading}
                incomingRequests={incomingRequests}
                outgoingRequests={outgoingRequests}
                acceptedFriendships={acceptedFriendships}
                profilesById={profilesById}
                onAcceptRequest={handleAcceptRequest}
                onDeclineRequest={handleDeclineRequest}
                onSignOut={handleSignOut}
              />
            )}
          </div>
        </main>

        <BottomNav view={view} onChangeView={setView} onOpenLogging={openLogging} />

        <LogModal
          open={isLogging}
          onClose={() => setIsLogging(false)}
          selectedType={selectedType}
          onSelectType={setSelectedType}
          onConfirm={handleLog}
          isSaving={isSavingLog}
          stoolTypes={STOOL_TYPES}
        />
      </div>
    </div>
  );
}
