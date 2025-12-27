import type { PoopLog, TimePeriodStat } from '../types/models';

export const calculateStreak = (logs: PoopLog[]): number => {
  if (!logs.length) return 0;
  const logDays = new Set(logs.map((log) => new Date(log.occurred_at).toDateString()));
  const cursor = new Date();
  let count = 0;
  while (logDays.has(cursor.toDateString())) {
    count += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
};

export const getDayName = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

export const calculateAvgType = (logs: PoopLog[]): number | null => {
  if (!logs.length) return null;
  const total = logs.reduce((sum, log) => sum + log.type, 0);
  return total / logs.length;
};

export const calculateTimePeriodStats = (logs: PoopLog[]): TimePeriodStat[] => {
  const periods: Omit<TimePeriodStat, 'count' | 'percentage'>[] = [
    { label: 'Morning', hours: [6, 7, 8, 9, 10, 11], emoji: '🌅' },
    { label: 'Afternoon', hours: [12, 13, 14, 15, 16, 17], emoji: '☀️' },
    { label: 'Evening', hours: [18, 19, 20, 21], emoji: '🌆' },
    { label: 'Night', hours: [22, 23, 0, 1, 2, 3, 4, 5], emoji: '🌙' },
  ];

  return periods.map((period) => {
    const count = logs.filter((log) => {
      const hour = new Date(log.occurred_at).getHours();
      return period.hours.includes(hour);
    }).length;
    const percentage = logs.length > 0 ? Math.round((count / logs.length) * 100) : 0;
    return { ...period, count, percentage };
  });
};

export const getBestPeriod = (stats: TimePeriodStat[]): TimePeriodStat | null => {
  if (!stats.length) return null;
  return stats.reduce((best, current) => (current.count > best.count ? current : best), stats[0]);
};

export const calculateHealthScore = (avgType: number | null, streak: number, logCount: number): number => {
  if (!logCount || avgType === null) return 0;
  const typeScore = Math.max(0, 100 - Math.round(Math.abs(avgType - 4) * 20));
  const streakBonus = Math.min(streak, 14) * 2;
  return Math.min(100, typeScore + streakBonus);
};
