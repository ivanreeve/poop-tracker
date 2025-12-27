import { useMemo } from 'react';
import {
  calculateAvgType,
  calculateHealthScore,
  calculateStreak,
  calculateTimePeriodStats,
  getBestPeriod,
} from '../lib/calculations';
import type { PoopLog, StatsSummary } from '../types/models';

export const useStats = (logs: PoopLog[]): StatsSummary => {
  const streak = useMemo(() => calculateStreak(logs), [logs]);
  const avgType = useMemo(() => calculateAvgType(logs), [logs]);
  const avgTypeDisplay = avgType ? avgType.toFixed(1) : '0';

  const timePeriodStats = useMemo(() => calculateTimePeriodStats(logs), [logs]);
  const bestPeriod = useMemo(() => getBestPeriod(timePeriodStats), [timePeriodStats]);

  const healthScore = useMemo(() => calculateHealthScore(avgType, streak, logs.length), [avgType, streak, logs.length]);
  const healthScoreDisplay = logs.length ? Math.round(healthScore).toString() : '0';

  const averageInsightTitle = avgType ? `Avg type ${avgType.toFixed(1)}` : 'No average yet';
  const averageInsightSubtitle = avgType
    ? 'Ideal is around 4.0 on the Bristol scale.'
    : 'Log a few entries to see your average.';

  const streakInsightTitle = logs.length ? `Streak: ${streak} day${streak === 1 ? '' : 's'}` : 'No streak yet';
  const streakInsightSubtitle = logs.length ? 'Keep logging daily to build consistency.' : 'Log today to start a streak.';

  const bestPeriodLabel = bestPeriod && bestPeriod.count > 0 ? bestPeriod.label : null;
  const bestPeriodInsightTitle = bestPeriodLabel ? `Top time: ${bestPeriodLabel}` : 'No time pattern yet';
  const bestPeriodInsightSubtitle = bestPeriodLabel
    ? `${bestPeriod!.count} logs during the ${bestPeriodLabel.toLowerCase()}.`
    : 'Add more logs to reveal a pattern.';

  return {
    streak,
    avgTypeDisplay,
    timePeriodStats,
    healthScoreDisplay,
    averageInsightTitle,
    averageInsightSubtitle,
    streakInsightTitle,
    streakInsightSubtitle,
    bestPeriodInsightTitle,
    bestPeriodInsightSubtitle,
  };
};
