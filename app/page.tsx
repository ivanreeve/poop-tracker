"use client"

/* eslint-disable @next/next/no-img-element */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Plus,
  BarChart2,
  Flame,
  Check,
  X,
  ChevronRight,
  Droplets,
  Sparkles,
  Target,
  Award,
  Activity,
  LogIn,
  LogOut,
  UserPlus,
  Users,
  Mail,
  Loader2
} from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

/**
 * PoopPal - A Tracker with Duolingo Feel & Flo Colors
 * Fully Responsive: Desktop, Tablet, Mobile
 */

// --- Components ---
type PoopLog = {
  id: string;
  user_id: string;
  type: number;
  notes: string | null;
  occurred_at: string;
};

type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
};

type Friendship = {
  id: string;
  user_id: string;
  friend_id: string;
  status: 'pending' | 'accepted';
  created_at: string;
};

// Juicy Button Component (Duolingo Style)
const JuicyButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  fullWidth = false,
  disabled = false
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  className?: string;
  fullWidth?: boolean;
  disabled?: boolean;
}) => {
  // Color Schemas (Flo Inspired)
  const variants = {
    primary: {
      bg: 'bg-[#FF8096]', // Flo Pink
      border: 'border-[#D65D73]',
      text: 'text-white',
      hover: 'hover:bg-[#FF94A8]',
    },
    secondary: {
      bg: 'bg-[#A6D8D4]', // Flo Teal
      border: 'border-[#7CB2AE]',
      text: 'text-white',
      hover: 'hover:bg-[#B8E6E2]',
    },
    outline: {
      bg: 'bg-[#F5F5F5]',
      border: 'border-[#E0E0E0]',
      text: 'text-[#7A7A7A]',
      hover: 'hover:bg-[#ECECEC]',
    },
    danger: {
      bg: 'bg-[#FFB7B2]', // Soft Red
      border: 'border-[#E08F8A]',
      text: 'text-white',
      hover: 'hover:bg-[#FFC9C5]',
    },
    success: {
      bg: 'bg-[#98DE8F]', // Soft Green
      border: 'border-[#7BC172]',
      text: 'text-white',
      hover: 'hover:bg-[#A9EFA0]',
    }
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm border-b-4',
    md: 'px-6 py-3 text-base border-b-4',
    lg: 'px-8 py-4 text-lg md:text-xl font-bold border-b-[6px]',
    icon: 'p-3 border-b-4 rounded-2xl'
  };

  const currentVariant = variants[variant];
  const currentSize = sizes[size] || sizes.md;

  return (
    <button
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      className={`
        relative 
        transition-all 
        duration-150 
        transform 
        rounded-2xl 
        font-extrabold 
        flex items-center justify-center gap-2
        ${currentVariant.bg} 
        ${currentVariant.border} 
        ${currentVariant.text}
        ${!disabled ? currentVariant.hover : 'opacity-50 cursor-not-allowed'}
        ${!disabled ? 'active:border-b-0 active:translate-y-[4px] hover:scale-[1.02]' : ''}
        ${fullWidth ? 'w-full' : ''}
        ${currentSize}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

// Bristol Scale Card (Responsive)
const StoolTypeCard = ({
  label,
  selected,
  onClick,
  emoji,
  delay = 0
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  emoji: string;
  delay?: number;
}) => (
  <div
    onClick={onClick}
    style={{ animationDelay: `${delay}ms` }}
    className={`
      cursor-pointer
      relative p-3 sm:p-4 rounded-2xl border-2 transition-all duration-200
      flex flex-col items-center gap-1 sm:gap-2
      animate-scale-in
      ${selected
        ? 'border-[#FF8096] bg-[#FFF0F3] scale-[1.02] shadow-lg'
        : 'border-gray-200 bg-white hover:border-[#FFB7B2] hover:-translate-y-1 hover:shadow-md shadow-sm'}
    `}
  >
    <div className={`text-3xl sm:text-4xl md:text-5xl filter drop-shadow-sm transition-transform duration-200 ${selected ? 'animate-wiggle' : ''}`}>{emoji}</div>
    <div className="text-center">
      <div className={`font-bold text-sm sm:text-base ${selected ? 'text-[#FF8096]' : 'text-gray-600'}`}>{label}</div>
    </div>
    {selected && (
      <div className="absolute top-2 right-2 bg-[#FF8096] text-white rounded-full p-1 animate-bounce-in">
        <Check size={12} strokeWidth={4} />
      </div>
    )}
  </div>
);

// Stat Card (Responsive)
const StatCard = ({
  icon: Icon,
  value,
  label,
  color,
  delay = 0
}: {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  value: string | number;
  label: string;
  color: string;
  delay?: number;
}) => (
  <div
    style={{ animationDelay: `${delay}ms` }}
    className="bg-white rounded-2xl p-3 sm:p-4 md:p-5 border-2 border-gray-100 shadow-sm flex items-center gap-3 sm:gap-4 card-hover animate-slide-up"
  >
    <div className={`p-2 sm:p-3 rounded-xl ${color} transition-transform duration-300 hover:rotate-12`}>
      <Icon size={20} className="text-white sm:w-6 sm:h-6" />
    </div>
    <div>
      <div className="text-xl sm:text-2xl md:text-3xl font-black text-gray-700">{value}</div>
      <div className="text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-wide">{label}</div>
    </div>
  </div>
);

// Weekly Chart Component
const WeeklyChart = ({ logs }: { logs: PoopLog[] }) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();

  // Calculate logs per day for the last 7 days
  const weekData = days.map((day, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    const count = logs.filter(log => {
      const logDate = new Date(log.occurred_at);
      return logDate.toDateString() === date.toDateString();
    }).length;
    return { day, count, isToday: date.toDateString() === today.toDateString() };
  });

  const maxCount = Math.max(...weekData.map(d => d.count), 1);

  return (
    <div className="flex items-end justify-between gap-1 sm:gap-2 h-24 sm:h-32 md:h-40">
      {weekData.map((data, index) => (
        <div key={data.day} className="flex-1 flex flex-col items-center gap-1 sm:gap-2">
          <div
            className={`w-full rounded-t-xl transition-all duration-500 ease-out ${data.isToday ? 'bg-[#FF8096]' : 'bg-[#A6D8D4]'
              }`}
            style={{
              height: `${(data.count / maxCount) * 100}%`,
              minHeight: data.count > 0 ? '12px' : '4px',
              animationDelay: `${index * 100}ms`
            }}
          />
          <span className={`text-[10px] sm:text-xs font-bold ${data.isToday ? 'text-[#FF8096]' : 'text-gray-400'}`}>
            {data.day}
          </span>
        </div>
      ))}
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState<'dashboard' | 'stats' | 'profile'>('dashboard');
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

  // Logging State
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

  // Bristol Scale Data
  const stoolTypes = [
    { type: 1, label: 'Hard', emoji: '🪨' },
    { type: 2, label: 'Lumpy', emoji: '🥜' },
    { type: 3, label: 'Cracked', emoji: '🌽' },
    { type: 4, label: 'Smooth', emoji: '🌭' },
    { type: 5, label: 'Soft', emoji: '☁️' },
    { type: 6, label: 'Mushy', emoji: '🍦' },
    { type: 7, label: 'Liquid', emoji: '💧' },
  ];

  const calculateStreak = (logs: PoopLog[]) => {
    if (!logs.length) return 0;
    const logDays = new Set(logs.map(log => new Date(log.occurred_at).toDateString()));
    const cursor = new Date();
    let count = 0;
    while (logDays.has(cursor.toDateString())) {
      count += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return count;
  };

  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

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
    setProfilesById(prev => ({ ...prev, [data.id]: data }));
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

    const accepted = updatedFriendships.filter(friendship => friendship.status === 'accepted');
    const allFriendIds = Array.from(
      new Set(
        updatedFriendships.map(friendship =>
          friendship.user_id === currentUserId ? friendship.friend_id : friendship.user_id
        )
      )
    );
    const acceptedFriendIds = accepted.map(friendship =>
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
      setProfilesById(prev => ({ ...prev, ...profileMap }));
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

    setUserLogs(prev => [data, ...prev]);
    setIsLogging(false);
    setSelectedType(null);
    setIsSavingLog(false);
  };

  const handleAddFriend = async (event: React.FormEvent) => {
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

    const existingFriendship = friendships.some(friendship => {
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
    const { error } = await supabase
      .from('friendships')
      .update({ status: 'accepted' })
      .eq('id', requestId);

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

  const avgType = useMemo(() => {
    if (!userLogs.length) return null;
    return userLogs.reduce((sum, log) => sum + log.type, 0) / userLogs.length;
  }, [userLogs]);

  const avgTypeDisplay = avgType ? avgType.toFixed(1) : '0';

  const timePeriodStats = useMemo(() => {
    const periods = [
      { label: 'Morning', hours: [6, 7, 8, 9, 10, 11], emoji: '🌅' },
      { label: 'Afternoon', hours: [12, 13, 14, 15, 16, 17], emoji: '☀️' },
      { label: 'Evening', hours: [18, 19, 20, 21], emoji: '🌆' },
      { label: 'Night', hours: [22, 23, 0, 1, 2, 3, 4, 5], emoji: '🌙' },
    ];

    return periods.map((period) => {
      const count = userLogs.filter(log => {
        const hour = new Date(log.occurred_at).getHours();
        return period.hours.includes(hour);
      }).length;
      const percentage = userLogs.length > 0 ? Math.round((count / userLogs.length) * 100) : 0;
      return { ...period, count, percentage };
    });
  }, [userLogs]);

  const bestPeriod = useMemo(() => {
    if (!userLogs.length) return null;
    return timePeriodStats.reduce((best, current) => (current.count > best.count ? current : best), timePeriodStats[0]);
  }, [timePeriodStats, userLogs.length]);

  const healthScore = useMemo(() => {
    if (!userLogs.length || avgType === null) return 0;
    const typeScore = Math.max(0, 100 - Math.round(Math.abs(avgType - 4) * 20));
    const streakBonus = Math.min(streak, 14) * 2;
    return Math.min(100, typeScore + streakBonus);
  }, [avgType, streak, userLogs.length]);

  const healthScoreDisplay = userLogs.length ? Math.round(healthScore).toString() : '0';
  const averageInsightTitle = avgType ? `Avg type ${avgType.toFixed(1)}` : 'No average yet';
  const averageInsightSubtitle = avgType
    ? 'Ideal is around 4.0 on the Bristol scale.'
    : 'Log a few entries to see your average.';
  const streakInsightTitle = userLogs.length
    ? `Streak: ${streak} day${streak === 1 ? '' : 's'}`
    : 'No streak yet';
  const streakInsightSubtitle = userLogs.length
    ? 'Keep logging daily to build consistency.'
    : 'Log today to start a streak.';
  const bestPeriodLabel = bestPeriod && bestPeriod.count > 0 ? bestPeriod.label : null;
  const bestPeriodInsightTitle = bestPeriodLabel ? `Top time: ${bestPeriodLabel}` : 'No time pattern yet';
  const bestPeriodInsightSubtitle = bestPeriodLabel
    ? `${bestPeriod.count} logs during the ${bestPeriodLabel.toLowerCase()}.`
    : 'Add more logs to reveal a pattern.';

  const acceptedFriendships = useMemo(
    () => friendships.filter(friendship => friendship.status === 'accepted'),
    [friendships]
  );
  const incomingRequests = useMemo(
    () => friendships.filter(friendship => friendship.status === 'pending' && friendship.friend_id === user?.id),
    [friendships, user?.id]
  );
  const outgoingRequests = useMemo(
    () => friendships.filter(friendship => friendship.status === 'pending' && friendship.user_id === user?.id),
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
      {/* Main Container - Responsive */}
      <div className="w-full min-h-screen flex flex-col lg:flex-row">

        {/* Sidebar for Desktop */}
        <aside className="hidden lg:flex lg:w-72 xl:w-80 bg-white border-r-2 border-gray-100 flex-col fixed h-full z-20">
          {/* Logo */}
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
                <div className="w-10 h-10 rounded-xl bg-[#FFF0F3] border-2 border-[#FFE8EC] flex items-center justify-center overflow-hidden">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={greetingName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Users size={18} className="text-[#FF8096]" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-sm text-gray-700 truncate">{greetingName}</div>
                  <div className="text-[10px] font-bold text-gray-400 truncate">{user.email}</div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-2 rounded-xl border border-gray-100 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                  aria-label="Sign out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <JuicyButton
                variant="secondary"
                size="sm"
                fullWidth
                onClick={handleGoogleSignIn}
                disabled={authLoading}
              >
                {authLoading ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
                {authLoading ? 'CHECKING...' : 'SIGN IN WITH GOOGLE'}
              </JuicyButton>
            )}
          </div>

          <div className="p-4">
            <JuicyButton
              variant="primary"
              size="md"
              fullWidth
              onClick={openLogging}
              disabled={!user}
            >
              <Plus size={20} />
              {user ? 'LOG NOW' : 'SIGN IN TO LOG'}
            </JuicyButton>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {[
              { id: 'dashboard', icon: Droplets, label: 'Dashboard' },
              { id: 'stats', icon: BarChart2, label: 'Statistics' },
              { id: 'profile', icon: Users, label: 'Friends' }
            ].map((item, index) => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                style={{ animationDelay: `${index * 100}ms` }}
                className={`
                  cursor-pointer w-full flex items-center gap-4 p-4 rounded-md transition-all duration-200 animate-slide-up
                  ${view === item.id
                    ? 'bg-[#FFF0F3] text-[#FF8096]'
                    : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}
                `}
              >
                <item.icon size={24} strokeWidth={2.5} className={view === item.id ? 'text-[#FF8096]' : ''} />
                <span className="font-bold">{item.label}</span>
                {view === item.id && (
                  <ChevronRight size={18} className="ml-auto text-[#FF8096]" />
                )}
              </button>
            ))}
          </nav>

        </aside>

        {/* Main Content Area */}
        <main className="flex-1 lg:ml-72 xl:ml-80">
          {/* Mobile/Tablet Header */}
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
                <button
                  onClick={() => setView('profile')}
                  className="bg-[#FF8096] w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-[#D65D73] flex items-center justify-center overflow-hidden"
                  aria-label="Profile"
                >
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={greetingName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Sparkles size={16} className="text-white" />
                  )}
                </button>
              ) : (
                <button
                  onClick={handleGoogleSignIn}
                  className="bg-[#A6D8D4] w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-[#7CB2AE] flex items-center justify-center"
                  aria-label="Sign in with Google"
                >
                  <LogIn size={16} className="text-white" />
                </button>
              )}
            </div>
          </header>

          {/* Content Area */}
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
                    <p className="text-xs sm:text-sm font-bold text-gray-400">Google login unlocks logging and friend sharing.</p>
                  </div>
                </div>
                <JuicyButton
                  variant="secondary"
                  size="md"
                  onClick={handleGoogleSignIn}
                  disabled={authLoading}
                >
                  <LogIn size={18} />
                  CONTINUE WITH GOOGLE
                </JuicyButton>
              </section>
            )}

            {user && view === 'dashboard' && (
              <>
                {/* Greeting */}
                <section className="animate-fade-in">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-700 mb-2">Hello, {greetingName}! 👋</h2>
                  <p className="text-gray-400 font-bold text-sm sm:text-base">Time to listen to your body.</p>
                </section>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {/* Day Streak */}
                  <section
                    className="bg-gradient-to-br from-orange-100 to-yellow-50 rounded-3xl p-5 sm:p-6 lg:p-8 border-2 border-orange-100 shadow-sm flex flex-col justify-between animate-slide-up"
                    style={{ animationDelay: '200ms' }}
                  >
                    <div className="flex items-center gap-3">
                      <Flame className="text-orange-400 fill-orange-400 animate-pulse-slow" size={32} />
                      <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-orange-500">{streak}</span>
                    </div>
                    <div className="mt-3">
                      <p className="text-sm sm:text-base font-extrabold text-orange-400">Day Streak! 🔥</p>
                      <p className="text-xs sm:text-sm font-medium text-orange-300 mt-1">Keep it going!</p>
                    </div>
                  </section>
                </div>

                {/* Recent History */}
                <section className="animate-slide-up" style={{ animationDelay: '300ms' }}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base sm:text-lg font-extrabold text-gray-700">Recent Logs</h3>
                    <button
                      onClick={() => setShowAllLogs(prev => !prev)}
                      disabled={userLogs.length <= 4}
                      className="cursor-pointer text-[#FF8096] font-bold text-xs sm:text-sm hover:underline transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {showAllLogs ? 'VIEW LESS' : 'VIEW ALL'}
                    </button>
                  </div>
                  {logsLoading ? (
                    <div className="bg-white rounded-2xl border-2 border-gray-100 p-4 text-xs sm:text-sm font-bold text-gray-400 flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      Loading your logs...
                    </div>
                  ) : (
                    <>
                      {visibleLogs.length === 0 ? (
                        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-6 text-center text-xs sm:text-sm font-bold text-gray-400">
                          No logs yet. Tap "LOG NOW" to add your first entry.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 stagger-children">
                          {visibleLogs.map((log) => {
                            const logType = stoolTypes.find(t => t.type === log.type);

                            return (
                              <div
                                key={log.id}
                                className="bg-white p-4 rounded-2xl border-2 border-gray-100 flex items-center justify-between card-hover"
                              >
                                <div className="flex items-center gap-3 sm:gap-4">
                                  <div className="bg-[#F0F8FF] p-2.5 sm:p-3 rounded-xl text-lg sm:text-xl">
                                    {logType?.emoji}
                                  </div>
                                  <div>
                                    <div className="font-bold text-gray-700 text-sm sm:text-base">{logType?.label}</div>
                                    <div className="text-[10px] sm:text-xs font-bold text-gray-400">
                                      {new Date(log.occurred_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                  </div>
                                </div>
                                <div className="font-extrabold text-gray-300 text-xs sm:text-sm">
                                  {getDayName(log.occurred_at)}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </>
                  )}
                </section>

                {/* Friends' Logs */}
                {acceptedFriendships.length > 0 && (
                  <section className="animate-slide-up" style={{ animationDelay: '350ms' }}>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-base sm:text-lg font-extrabold text-gray-700">Friends' Logs</h3>
                      <span className="text-[10px] sm:text-xs font-bold text-gray-400">{acceptedFriendships.length} friends</span>
                    </div>
                    {friendsLoading ? (
                      <div className="bg-white rounded-2xl border-2 border-gray-100 p-4 text-xs sm:text-sm font-bold text-gray-400 flex items-center gap-2">
                        <Loader2 size={16} className="animate-spin" />
                        Loading friends...
                      </div>
                    ) : (
                      <>
                        {friendLogs.length === 0 ? (
                          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-6 text-center text-xs sm:text-sm font-bold text-gray-400">
                            No friend logs yet. Invite friends to start sharing.
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                            {friendLogs.slice(0, 6).map((log) => {
                              const logType = stoolTypes.find(t => t.type === log.type);
                              const friendProfile = profilesById[log.user_id];
                              const friendName = friendProfile?.full_name || friendProfile?.email || 'Friend';

                              return (
                                <div
                                  key={log.id}
                                  className="bg-white p-4 rounded-2xl border-2 border-gray-100 flex items-center justify-between card-hover"
                                >
                                  <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="bg-[#F0F8FF] p-2.5 sm:p-3 rounded-xl text-lg sm:text-xl">
                                      {logType?.emoji}
                                    </div>
                                    <div>
                                      <div className="font-bold text-gray-700 text-sm sm:text-base">{logType?.label}</div>
                                      <div className="text-[10px] sm:text-xs font-bold text-gray-400">
                                        {friendName}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="font-extrabold text-gray-300 text-xs sm:text-sm">
                                    {getDayName(log.occurred_at)}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </>
                    )}
                  </section>
                )}
              </>
            )}

            {user && view === 'stats' && (
              <>
                {/* Stats Page Header */}
                <section className="animate-fade-in">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-700 mb-2">Statistics 📊</h2>
                  <p className="text-gray-400 font-bold text-sm sm:text-base">Track your digestive health journey.</p>
                </section>

                {/* Overview Stats Grid */}
                <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <StatCard
                    icon={Check}
                    value={userLogs.length}
                    label="Total Logs"
                    color="bg-[#A6D8D4]"
                    delay={100}
                  />
                  <StatCard
                    icon={Flame}
                    value={streak}
                    label="Day Streak"
                    color="bg-[#FFB7B2]"
                    delay={200}
                  />
                  <StatCard
                    icon={Activity}
                    value={avgTypeDisplay}
                    label="Avg Type"
                    color="bg-[#B4A7D6]"
                    delay={300}
                  />
                  <StatCard
                    icon={Target}
                    value={healthScoreDisplay}
                    label="Healthy Score"
                    color="bg-[#98DE8F]"
                    delay={400}
                  />
                </section>

                {/* Main Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

                  {/* Weekly Overview */}
                  <section className="bg-white rounded-3xl p-5 sm:p-6 lg:p-8 border-2 border-gray-100 shadow-sm animate-slide-up" style={{ animationDelay: '100ms' }}>
                    <div className="flex justify-between items-center mb-4 sm:mb-6">
                      <h3 className="text-base sm:text-lg font-extrabold text-gray-700">Weekly Activity</h3>
                      <span className="text-xs sm:text-sm font-bold text-[#FF8096]">Last 7 Days</span>
                    </div>
                    <WeeklyChart logs={userLogs} />
                  </section>

                  {/* Bristol Scale Distribution */}
                  <section className="bg-white rounded-3xl p-5 sm:p-6 lg:p-8 border-2 border-gray-100 shadow-sm animate-slide-up" style={{ animationDelay: '200ms' }}>
                    <div className="flex justify-between items-center mb-4 sm:mb-6">
                      <h3 className="text-base sm:text-lg font-extrabold text-gray-700">Type Distribution</h3>
                      <span className="text-xs sm:text-sm font-bold text-[#FF8096]">Bristol Scale</span>
                    </div>
                    <div className="space-y-3">
                      {stoolTypes.map((type) => {
                        const count = userLogs.filter(log => log.type === type.type).length;
                        const percentage = userLogs.length > 0 ? (count / userLogs.length * 100).toFixed(0) : 0;
                        return (
                          <div key={type.type} className="flex items-center gap-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#F0F8FF] rounded-xl flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
                              {type.emoji}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-sm sm:text-base text-gray-700">{type.label}</span>
                                <span className="font-bold text-xs sm:text-sm text-gray-400">{percentage}%</span>
                              </div>
                              <div className="h-3 sm:h-4 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    Number(percentage) > 0 ? 'bg-gradient-to-r from-[#FF8096] to-[#A6D8D4]' : 'bg-gray-200'
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  {/* Daily Pattern */}
                  <section className="bg-white rounded-3xl p-5 sm:p-6 lg:p-8 border-2 border-gray-100 shadow-sm animate-slide-up" style={{ animationDelay: '300ms' }}>
                    <div className="flex justify-between items-center mb-4 sm:mb-6">
                      <h3 className="text-base sm:text-lg font-extrabold text-gray-700">Daily Pattern</h3>
                      <span className="text-xs sm:text-sm font-bold text-[#FF8096]">By Time</span>
                    </div>
                    <div className="space-y-3">
                      {timePeriodStats.map((period) => (
                        <div key={period.label} className="flex items-center gap-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FFF9F3] rounded-xl flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
                              {period.emoji}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-sm sm:text-base text-gray-700">{period.label}</span>
                                <span className="font-bold text-xs sm:text-sm text-gray-400">{period.count} logs</span>
                              </div>
                              <div className="h-3 sm:h-4 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    period.percentage > 0 ? 'bg-gradient-to-r from-[#FFD966] to-[#FFB7B2]' : 'bg-gray-200'
                                  }`}
                                  style={{ width: `${period.percentage}%` }}
                                />
                              </div>
                            </div>
                          </div>
                      ))}
                    </div>
                  </section>

                  {/* Health Insights */}
                  <section className="bg-gradient-to-br from-[#FFF0F3] to-[#E8F4F3] rounded-3xl p-5 sm:p-6 lg:p-8 border-2 border-[#FFE8EC] shadow-sm animate-slide-up" style={{ animationDelay: '400ms' }}>
                    <div className="flex items-center gap-3 mb-4 sm:mb-6">
                      <div className="bg-[#FF8096] p-2 sm:p-3 rounded-xl animate-float">
                        <Award size={20} className="text-white sm:w-6 sm:h-6" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-extrabold text-gray-700">Health Insights</h3>
                        <p className="text-xs sm:text-sm font-bold text-gray-400">Your digestive wellness</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-white/70 rounded-2xl p-3 sm:p-4 border border-white/50">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="bg-[#98DE8F] p-1.5 sm:p-2 rounded-lg">
                            <Check size={12} className="text-white" />
                          </div>
                          <div>
                            <p className="font-bold text-xs sm:text-sm text-gray-700">{averageInsightTitle}</p>
                            <p className="text-[10px] sm:text-xs font-medium text-gray-400">{averageInsightSubtitle}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white/70 rounded-2xl p-3 sm:p-4 border border-white/50">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="bg-[#FFD966] p-1.5 sm:p-2 rounded-lg">
                            <Flame size={12} className="text-white" />
                          </div>
                          <div>
                            <p className="font-bold text-xs sm:text-sm text-gray-700">{streakInsightTitle}</p>
                            <p className="text-[10px] sm:text-xs font-medium text-gray-400">{streakInsightSubtitle}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white/70 rounded-2xl p-3 sm:p-4 border border-white/50">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="bg-[#A6D8D4] p-1.5 sm:p-2 rounded-lg">
                            <Activity size={12} className="text-white" />
                          </div>
                          <div>
                            <p className="font-bold text-xs sm:text-sm text-gray-700">{bestPeriodInsightTitle}</p>
                            <p className="text-[10px] sm:text-xs font-medium text-gray-400">{bestPeriodInsightSubtitle}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                </div>

                {/* Monthly Trend */}
                <section className="bg-white rounded-3xl p-5 sm:p-6 lg:p-8 border-2 border-gray-100 shadow-sm animate-slide-up" style={{ animationDelay: '500ms' }}>
                  <div className="flex justify-between items-center mb-4 sm:mb-6">
                    <h3 className="text-base sm:text-lg font-extrabold text-gray-700">Monthly Trend</h3>
                    <span className="text-xs sm:text-sm font-bold text-[#FF8096]">Last 30 Days</span>
                  </div>
                  <div className="grid grid-cols-10 gap-1 sm:gap-2">
                    {Array.from({ length: 30 }, (_, i) => {
                      const date = new Date();
                      date.setDate(date.getDate() - (29 - i));
                      const hasLog = userLogs.some(log => new Date(log.occurred_at).toDateString() === date.toDateString());
                      const isToday = date.toDateString() === new Date().toDateString();
                      return (
                        <div
                          key={i}
                          className={`aspect-square rounded-lg sm:rounded-xl flex items-center justify-center text-[10px] sm:text-xs font-bold transition-all hover:scale-110 cursor-default ${
                            hasLog 
                              ? `bg-gradient-to-br ${isToday ? 'from-[#FF8096] to-[#D65D73]' : 'from-[#A6D8D4] to-[#7CB2AE]'} text-white shadow-md`
                              : 'bg-gray-100 text-gray-300'
                          }`}
                          title={date.toLocaleDateString()}
                        >
                          {isToday ? '📍' : hasLog ? '✓' : ''}
                        </div>
                      );
                    })}
                  </div>
                </section>

              </>
            )}

            {user && view === 'profile' && (
              <>
                <section className="animate-fade-in">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-700 mb-2">Profile & Friends</h2>
                  <p className="text-gray-400 font-bold text-sm sm:text-base">Manage your account and share logs with friends.</p>
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-white rounded-3xl p-5 sm:p-6 lg:p-8 border-2 border-gray-100 shadow-sm animate-slide-up">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-[#FFF0F3] border-2 border-[#FFE8EC] flex items-center justify-center overflow-hidden">
                        {profile?.avatar_url ? (
                          <img src={profile.avatar_url} alt={greetingName} className="w-full h-full object-cover" />
                        ) : (
                          <Users size={24} className="text-[#FF8096]" />
                        )}
                      </div>
                      <div>
                        <div className="text-lg sm:text-xl font-extrabold text-gray-700">{greetingName}</div>
                        <div className="text-xs sm:text-sm font-bold text-gray-400">{user.email}</div>
                      </div>
                    </div>
                    <JuicyButton variant="outline" size="sm" onClick={handleSignOut}>
                      <LogOut size={16} />
                      SIGN OUT
                    </JuicyButton>
                  </div>

                  <div className="bg-white rounded-3xl p-5 sm:p-6 lg:p-8 border-2 border-gray-100 shadow-sm animate-slide-up">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-[#A6D8D4] p-2 sm:p-3 rounded-xl">
                        <UserPlus size={18} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-extrabold text-gray-700">Add a friend</h3>
                        <p className="text-xs sm:text-sm font-bold text-gray-400">Invite by email to share logs.</p>
                      </div>
                    </div>
                    <form onSubmit={handleAddFriend} className="space-y-3">
                      <div className="relative">
                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                        <input
                          type="email"
                          placeholder="friend@example.com"
                          value={friendEmail}
                          onChange={(event) => setFriendEmail(event.target.value)}
                          className="w-full rounded-2xl border-2 border-gray-100 bg-[#FFF9F9] px-9 py-2 text-sm font-bold text-gray-600 placeholder:text-gray-300 focus:outline-none focus:border-[#A6D8D4]"
                        />
                      </div>
                      <JuicyButton
                        variant="primary"
                        size="sm"
                        fullWidth
                        disabled={!friendEmail || friendActionLoading}
                      >
                        {friendActionLoading ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
                        SEND FRIEND REQUEST
                      </JuicyButton>
                    </form>
                  </div>
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-white rounded-3xl p-5 sm:p-6 lg:p-8 border-2 border-gray-100 shadow-sm animate-slide-up">
                    <div className="flex items-center gap-2 mb-4">
                      <Users size={18} className="text-[#FF8096]" />
                      <h3 className="text-base sm:text-lg font-extrabold text-gray-700">Friend Requests</h3>
                    </div>
                    {friendsLoading ? (
                      <div className="text-xs sm:text-sm font-bold text-gray-400 flex items-center gap-2">
                        <Loader2 size={16} className="animate-spin" />
                        Loading requests...
                      </div>
                    ) : (
                      <>
                        {incomingRequests.length === 0 && outgoingRequests.length === 0 ? (
                          <div className="text-xs sm:text-sm font-bold text-gray-400">
                            No pending requests right now.
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {incomingRequests.map(request => {
                              const requesterProfile = profilesById[request.user_id];
                              const requesterName = requesterProfile?.full_name || requesterProfile?.email || 'Friend';
                              return (
                                <div
                                  key={request.id}
                                  className="flex flex-wrap items-center justify-between gap-3 bg-[#FFF9F9] border-2 border-[#FFE8EC] rounded-2xl p-3"
                                >
                                  <div>
                                    <div className="font-bold text-sm text-gray-700">{requesterName}</div>
                                    <div className="text-[10px] font-bold text-gray-400">{requesterProfile?.email}</div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <JuicyButton
                                      variant="success"
                                      size="sm"
                                      onClick={() => handleAcceptRequest(request.id)}
                                      disabled={friendActionLoading}
                                    >
                                      ACCEPT
                                    </JuicyButton>
                                    <JuicyButton
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleDeclineRequest(request.id)}
                                      disabled={friendActionLoading}
                                    >
                                      DECLINE
                                    </JuicyButton>
                                  </div>
                                </div>
                              );
                            })}
                            {outgoingRequests.map(request => {
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

                  <div className="bg-white rounded-3xl p-5 sm:p-6 lg:p-8 border-2 border-gray-100 shadow-sm animate-slide-up">
                    <div className="flex items-center gap-2 mb-4">
                      <Users size={18} className="text-[#A6D8D4]" />
                      <h3 className="text-base sm:text-lg font-extrabold text-gray-700">Your Friends</h3>
                    </div>
                    {friendsLoading ? (
                      <div className="text-xs sm:text-sm font-bold text-gray-400 flex items-center gap-2">
                        <Loader2 size={16} className="animate-spin" />
                        Loading friends...
                      </div>
                    ) : (
                      <>
                        {acceptedFriendships.length === 0 ? (
                          <div className="text-xs sm:text-sm font-bold text-gray-400">
                            No friends yet. Add someone to start sharing logs.
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {acceptedFriendships.map(friendship => {
                              const friendId = friendship.user_id === user.id ? friendship.friend_id : friendship.user_id;
                              const friendProfile = profilesById[friendId];
                              const friendName = friendProfile?.full_name || friendProfile?.email || 'Friend';
                              return (
                                <div
                                  key={friendship.id}
                                  className="flex items-center gap-3 bg-[#F7FAFA] border-2 border-[#E8F4F3] rounded-2xl p-3"
                                >
                                  <div className="w-10 h-10 rounded-xl bg-white border-2 border-[#E8F4F3] flex items-center justify-center overflow-hidden">
                                    {friendProfile?.avatar_url ? (
                                      <img src={friendProfile.avatar_url} alt={friendName} className="w-full h-full object-cover" />
                                    ) : (
                                      <Users size={16} className="text-[#A6D8D4]" />
                                    )}
                                  </div>
                                  <div>
                                    <div className="font-bold text-sm text-gray-700">{friendName}</div>
                                    <div className="text-[10px] font-bold text-gray-400">{friendProfile?.email}</div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </section>
              </>
            )}

          </div>
        </main>

        {/* Mobile/Tablet Bottom Navigation */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t-2 border-gray-100 px-2 py-2 flex items-center justify-around z-20 pb-safe">
          {[
            { id: 'dashboard', icon: Droplets, label: 'Track' },
            { id: 'stats', icon: BarChart2, label: 'Stats' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`
                flex-1 flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl transition-all duration-200
                ${view === item.id ? 'bg-[#FFF0F3]' : 'bg-transparent'}
              `}
            >
              <item.icon
                size={24}
                strokeWidth={2.5}
                className={`transition-all duration-200 ${view === item.id ? 'text-[#FF8096] scale-110' : 'text-gray-300'}`}
              />
              <span className={`text-[10px] sm:text-xs font-bold mt-1 ${view === item.id ? 'text-[#FF8096]' : 'text-gray-300'}`}>
                {item.label}
              </span>
            </button>
          ))}

          <button
            onClick={openLogging}
            className="mx-2 flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FF8096] text-white border-b-4 border-[#D65D73] shadow-lg transition-all duration-150 active:border-b-0 active:translate-y-[4px] hover:scale-[1.03]"
          >
            <Plus size={26} strokeWidth={3} />
          </button>

          <button
            onClick={() => setView('profile')}
            className={`
              flex-1 flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl transition-all duration-200
              ${view === 'profile' ? 'bg-[#FFF0F3]' : 'bg-transparent'}
            `}
          >
            <Users
              size={24}
              strokeWidth={2.5}
              className={`transition-all duration-200 ${view === 'profile' ? 'text-[#FF8096] scale-110' : 'text-gray-300'}`}
            />
            <span className={`text-[10px] sm:text-xs font-bold mt-1 ${view === 'profile' ? 'text-[#FF8096]' : 'text-gray-300'}`}>
              Friends
            </span>
          </button>
        </nav>

        {/* Logging Modal Overlay */}
        {isLogging && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-lg bg-[#FFF9F9] rounded-3xl shadow-2xl overflow-hidden animate-scale-in max-h-[90vh] flex flex-col">
              {/* Modal Header */}
              <div className="px-4 sm:px-6 py-4 bg-white border-b border-gray-100 flex items-center justify-between shrink-0">
                <button onClick={() => setIsLogging(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <X size={24} className="text-gray-400 hover:text-gray-600" strokeWidth={3} />
                </button>
                <div className="bg-gray-100 rounded-full h-2 w-full max-w-[50%] mx-4">
                  <div className={`bg-[#FF8096] h-2 rounded-full transition-all duration-500 ${selectedType ? 'w-[100%]' : 'w-[33%]'}`}></div>
                </div>
                <div className="w-10"></div> {/* Spacer */}
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-black text-gray-700 text-center mb-2">How was it?</h2>
                <p className="text-center text-gray-400 font-bold text-sm mb-6 sm:mb-8">Select the type that best matches.</p>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                  {stoolTypes.map((t, index) => (
                    <StoolTypeCard
                      key={t.type}
                      label={t.label}
                      emoji={t.emoji}
                      selected={selectedType === t.type}
                      onClick={() => setSelectedType(prev => (prev === t.type ? null : t.type))}
                      delay={index * 50}
                    />
                  ))}
                </div>
              </div>

              <div className="p-4 sm:p-6 bg-white border-t-2 border-gray-100 shrink-0">
                <JuicyButton
                  variant={selectedType ? 'primary' : 'outline'}
                  size="lg"
                  fullWidth
                  disabled={!selectedType || isSavingLog}
                  onClick={handleLog}
                  className={selectedType ? 'animate-pulse-slow' : ''}
                >
                  {isSavingLog ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      SAVING...
                    </>
                  ) : selectedType ? (
                    <>
                      <Check size={20} />
                      CONFIRM LOG
                    </>
                  ) : 'SELECT A TYPE'}
                </JuicyButton>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
