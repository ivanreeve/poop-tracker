import { Activity, Award, Check, Flame, Target } from 'lucide-react';
import type { PoopLog, StoolType, TimePeriodStat } from '../../../types/models';
import { StatCard } from '../../ui/StatCard';
import { WeeklyChart } from '../../ui/WeeklyChart';
import { Skeleton, StatCardSkeleton, BarChartSkeleton, InsightCardSkeleton, SectionHeaderSkeleton } from '../../ui/skeleton';

type StatisticsProps = {
  userLogs: PoopLog[];
  stoolTypes: StoolType[];
  streak: number;
  avgTypeDisplay: string;
  healthScoreDisplay: string;
  timePeriodStats: TimePeriodStat[];
  averageInsightTitle: string;
  averageInsightSubtitle: string;
  streakInsightTitle: string;
  streakInsightSubtitle: string;
  bestPeriodInsightTitle: string;
  bestPeriodInsightSubtitle: string;
  loading?: boolean;
};

export const Statistics = ({
  userLogs,
  stoolTypes,
  streak,
  avgTypeDisplay,
  healthScoreDisplay,
  timePeriodStats,
  averageInsightTitle,
  averageInsightSubtitle,
  streakInsightTitle,
  streakInsightSubtitle,
  bestPeriodInsightTitle,
  bestPeriodInsightSubtitle,
  loading,
}: StatisticsProps) => (
  <>
    {loading ? (
      <SectionHeaderSkeleton />
    ) : (
      <section>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-700 mb-2">Statistics</h2>
      </section>
    )}

    {loading ? (
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </section>
    ) : (
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard icon={Check} value={userLogs.length} label="Total Logs" color="bg-[#A6D8D4]" delay={100} />
        <StatCard icon={Flame} value={streak} label="Day Streak" color="bg-[#c07865]" delay={200} />
        <StatCard icon={Activity} value={avgTypeDisplay} label="Avg Type" color="bg-[#B4A7D6]" delay={300} />
        <StatCard icon={Target} value={healthScoreDisplay} label="Healthy Score" color="bg-[#98DE8F]" delay={400} />
      </section>
    )}

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {loading ? (
        <section className="bg-white rounded-3xl p-5 sm:p-6 lg:p-8 border-2 border-gray-100 shadow-sm">
          <div className="space-y-2 mb-4 sm:mb-6">
            <Skeleton className="h-5 w-40 rounded" />
            <Skeleton className="h-4 w-20 rounded" />
          </div>
          <Skeleton className="h-40 w-full rounded-xl" />
        </section>
      ) : (
        <section
          className="bg-white rounded-3xl p-5 sm:p-6 lg:p-8 border-2 border-gray-100 shadow-sm"
        >
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-extrabold text-gray-700">Weekly Activity</h3>
            <span className="text-xs sm:text-sm font-bold text-[#5c1916]">Last 7 Days</span>
          </div>
          <WeeklyChart logs={userLogs} />
        </section>
      )}

      {loading ? (
        <section className="bg-white rounded-3xl p-5 sm:p-6 lg:p-8 border-2 border-gray-100 shadow-sm">
          <div className="space-y-2 mb-4 sm:mb-6">
            <Skeleton className="h-5 w-40 rounded" />
            <Skeleton className="h-4 w-20 rounded" />
          </div>
          <BarChartSkeleton />
        </section>
      ) : (
        <section
          className="bg-white rounded-3xl p-5 sm:p-6 lg:p-8 border-2 border-gray-100 shadow-sm"
        >
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-extrabold text-gray-700">Type Distribution</h3>
            <span className="text-xs sm:text-sm font-bold text-[#5c1916]">Bristol Scale</span>
          </div>
          <div className="space-y-3">
            {stoolTypes.map((type) => {
              const count = userLogs.filter((log) => log.type === type.type).length;
              const percentage = userLogs.length > 0 ? (count / userLogs.length) * 100 : 0;
              return (
                <div key={type.type} className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#F0F8FF] rounded-xl flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
                    {type.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-sm sm:text-base text-gray-700">{type.label}</span>
                      <span className="font-bold text-xs sm:text-sm text-gray-400">{Math.round(percentage)}%</span>
                    </div>
                    <div className="h-3 sm:h-4 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          percentage > 0 ? 'bg-gradient-to-r from-[#5c1916] to-[#A6D8D4]' : 'bg-gray-200'
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
      )}

      {loading ? (
        <section className="bg-white rounded-3xl p-5 sm:p-6 lg:p-8 border-2 border-gray-100 shadow-sm">
          <div className="space-y-2 mb-4 sm:mb-6">
            <Skeleton className="h-5 w-40 rounded" />
            <Skeleton className="h-4 w-16 rounded" />
          </div>
          <BarChartSkeleton />
        </section>
      ) : (
        <section
          className="bg-white rounded-3xl p-5 sm:p-6 lg:p-8 border-2 border-gray-100 shadow-sm"
        >
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-extrabold text-gray-700">Daily Pattern</h3>
            <span className="text-xs sm:text-sm font-bold text-[#5c1916]">By Time</span>
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
                        period.percentage > 0 ? 'bg-gradient-to-r from-[#FFD966] to-[#c07865]' : 'bg-gray-200'
                      }`}
                      style={{ width: `${period.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {loading ? (
        <section className="bg-gradient-to-br from-[#f4e9e5] to-[#E8F4F3] rounded-3xl p-5 sm:p-6 lg:p-8 border-2 border-[#ead2cb] shadow-sm">
          <div className="space-y-3 mb-4 sm:mb-6">
            <Skeleton className="h-8 w-10 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-40 rounded" />
              <Skeleton className="h-4 w-32 rounded" />
            </div>
          </div>
          <div className="space-y-3">
            <InsightCardSkeleton />
            <InsightCardSkeleton />
            <InsightCardSkeleton />
          </div>
        </section>
      ) : (
        <section
          className="bg-gradient-to-br from-[#f4e9e5] to-[#E8F4F3] rounded-3xl p-5 sm:p-6 lg:p-8 border-2 border-[#ead2cb] shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="bg-[#5c1916] p-2 sm:p-3 rounded-xl">
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
      )}
    </div>

    {loading ? (
      <section className="bg-white rounded-3xl p-5 sm:p-6 lg:p-8 border-2 border-gray-100 shadow-sm">
        <div className="space-y-2 mb-4 sm:mb-6">
          <Skeleton className="h-5 w-40 rounded" />
          <Skeleton className="h-4 w-24 rounded" />
        </div>
        <div className="grid grid-cols-10 gap-1 sm:gap-2">
          {Array.from({ length: 30 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-lg sm:rounded-xl" />
          ))}
        </div>
      </section>
    ) : (
      <section
        className="bg-white rounded-3xl p-5 sm:p-6 lg:p-8 border-2 border-gray-100 shadow-sm"
      >
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-extrabold text-gray-700">Monthly Trend</h3>
          <span className="text-xs sm:text-sm font-bold text-[#5c1916]">Last 30 Days</span>
        </div>
        <div className="grid grid-cols-10 gap-1 sm:gap-2">
          {Array.from({ length: 30 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (29 - i));
            const hasLog = userLogs.some((log) => new Date(log.occurred_at).toDateString() === date.toDateString());
            const isToday = date.toDateString() === new Date().toDateString();
            return (
              <div
                key={i}
                className={`aspect-square rounded-lg sm:rounded-xl transition-all hover:scale-110 cursor-default ${
                  hasLog
                    ? `bg-gradient-to-br ${
                        isToday ? 'from-[#5c1916] to-[#3f0f0d]' : 'from-[#A6D8D4] to-[#7CB2AE]'
                      } text-white shadow-md`
                    : 'bg-gray-100 text-gray-300'
                }`}
                title={date.toLocaleDateString()}
              />
            );
          })}
        </div>
      </section>
    )}
  </>
);
