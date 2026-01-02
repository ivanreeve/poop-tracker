import { Activity, Check, Flame, Target } from 'lucide-react';
import type { PoopLog, StoolType, TimePeriodStat } from '../../../types/models';
import { StatCard } from '../../ui/StatCard';
import { WeeklyChart } from '../../ui/WeeklyChart';
import { Skeleton, StatCardSkeleton, BarChartSkeleton, SectionHeaderSkeleton } from '../../ui/skeleton';

type StatisticsProps = {
  userLogs: PoopLog[];
  stoolTypes: StoolType[];
  streak: number;
  avgTypeDisplay: string;
  healthScoreDisplay: string;
  timePeriodStats: TimePeriodStat[];
  loading?: boolean;
};

export const Statistics = ({
  userLogs,
  stoolTypes,
  streak,
  avgTypeDisplay,
  healthScoreDisplay,
  timePeriodStats,
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
      <section className="bg-white rounded-3xl p-5 sm:p-6 lg:p-8 border-2 border-gray-100">
        <div className="space-y-2 mb-4 sm:mb-6">
          <Skeleton className="h-5 w-40 rounded" />
          <Skeleton className="h-4 w-24 rounded" />
        </div>
        <div className="grid grid-cols-10 gap-1 sm:gap-2">
          {Array.from({ length: 30 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-sm" />
          ))}
        </div>
      </section>
    ) : (
      <section
        className="bg-white rounded-3xl p-5 sm:p-6 lg:p-8 border-2 border-gray-100"
      >
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-extrabold text-gray-700">Monthly Trend</h3>
          <span className="text-xs sm:text-sm font-bold text-[#5c1916]">Last 30 Days</span>
        </div>
        <div className="grid grid-cols-10 gap-1 sm:gap-2">
          {Array.from({ length: 30 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (29 - i));
            const logCount = userLogs.filter((log) => new Date(log.occurred_at).toDateString() === date.toDateString()).length;
            
            const getHeatmapColor = (count: number) => {
              if (count === 0) return 'bg-gray-100';
              if (count === 1) return 'bg-[var(--flo-coral)]';
              if (count <= 3) return 'bg-[var(--flo-pink)]';
              return 'bg-[var(--flo-pink-dark)]';
            };
            
            return (
              <div
                key={i}
                className={`aspect-square rounded-sm cursor-default ${getHeatmapColor(logCount)}`}
                title={`${date.toLocaleDateString()}: ${logCount} log${logCount !== 1 ? 's' : ''}`}
              />
            );
          })}
        </div>
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
        <StatCard icon={Check} value={userLogs.length} label="Total Logs" accentColor="#A6D8D4" delay={100} />
        <StatCard icon={Flame} value={streak} label="Day Streak" accentColor="#c07865" delay={200} />
        <StatCard icon={Activity} value={avgTypeDisplay} label="Avg Type" accentColor="#B4A7D6" delay={300} />
        <StatCard icon={Target} value={healthScoreDisplay} label="Healthy Score" accentColor="#98DE8F" delay={400} />
      </section>
    )}

    <div className="grid grid-cols-1 gap-4 sm:gap-6">
      {loading ? (
        <section className="bg-white rounded-3xl p-5 sm:p-6 lg:p-8 border-2 border-gray-100">
          <div className="space-y-2 mb-4 sm:mb-6">
            <Skeleton className="h-5 w-40 rounded" />
            <Skeleton className="h-4 w-20 rounded" />
          </div>
          <Skeleton className="h-40 w-full rounded-xl" />
        </section>
      ) : (
        <section
          className="bg-white rounded-3xl p-5 sm:p-6 lg:p-8 border-2 border-gray-100"
        >
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-extrabold text-gray-700">Weekly Activity</h3>
            <span className="text-xs sm:text-sm font-bold text-[#5c1916]">Last 7 Days</span>
          </div>
          <WeeklyChart logs={userLogs} />
        </section>
      )}

      {loading ? (
        <section className="bg-white rounded-3xl p-5 sm:p-6 lg:p-8 border-2 border-gray-100">
          <div className="space-y-2 mb-4 sm:mb-6">
            <Skeleton className="h-5 w-40 rounded" />
            <Skeleton className="h-4 w-20 rounded" />
          </div>
          <BarChartSkeleton />
        </section>
      ) : (
        <section
          className="bg-white rounded-3xl p-5 sm:p-6 lg:p-8 border-2 border-gray-100"
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
                          percentage > 0 ? 'striped-brown' : 'bg-gray-200'
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {loading ? (
          <section className="bg-white rounded-3xl p-5 sm:p-6 lg:p-8 border-2 border-gray-100">
            <div className="space-y-2 mb-4 sm:mb-6">
              <Skeleton className="h-5 w-40 rounded" />
              <Skeleton className="h-4 w-16 rounded" />
            </div>
            <BarChartSkeleton />
          </section>
        ) : (
          <section
            className="bg-white rounded-3xl p-5 sm:p-6 lg:p-8 border-2 border-gray-100"
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
                          period.percentage > 0 ? 'striped-yellow' : 'bg-gray-200'
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

      </div>
    </div>
  </>
);
