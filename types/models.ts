export type AppView = 'dashboard' | 'stats' | 'profile';

export type StoolType = {
  type: number;
  label: string;
  emoji: string;
};

export type PoopLog = {
  id: string;
  user_id: string;
  type: number;
  notes: string | null;
  occurred_at: string;
};

export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
};

export type FriendshipStatus = 'pending' | 'accepted';

export type Friendship = {
  id: string;
  user_id: string;
  friend_id: string;
  status: FriendshipStatus;
  created_at: string;
};

export type TimePeriodStat = {
  label: string;
  hours: number[];
  emoji: string;
  count: number;
  percentage: number;
};

export type StatsSummary = {
  streak: number;
  avgTypeDisplay: string;
  timePeriodStats: TimePeriodStat[];
  healthScoreDisplay: string;
  averageInsightTitle: string;
  averageInsightSubtitle: string;
  streakInsightTitle: string;
  streakInsightSubtitle: string;
  bestPeriodInsightTitle: string;
  bestPeriodInsightSubtitle: string;
};
