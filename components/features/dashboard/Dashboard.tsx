import type { PoopLog, Profile, StoolType } from '../../../types/models';
import { getDayName } from '../../../lib/calculations';
import { Flame, Loader2 } from 'lucide-react';

type DashboardProps = {
  greetingName: string;
  streak: number;
  userLogs: PoopLog[];
  visibleLogs: PoopLog[];
  showAllLogs: boolean;
  onToggleShowAll: () => void;
  logsLoading: boolean;
  stoolTypes: StoolType[];
  friendLogs: PoopLog[];
  acceptedFriendsCount: number;
  friendsLoading: boolean;
  profilesById: Record<string, Profile>;
};

export const Dashboard = ({
  greetingName,
  streak,
  userLogs,
  visibleLogs,
  showAllLogs,
  onToggleShowAll,
  logsLoading,
  stoolTypes,
  friendLogs,
  acceptedFriendsCount,
  friendsLoading,
  profilesById,
}: DashboardProps) => (
  <>
    <section className="animate-fade-in">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-700 mb-2">Hello, {greetingName}!</h2>
    </section>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
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

    <section className="animate-slide-up" style={{ animationDelay: '300ms' }}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base sm:text-lg font-extrabold text-gray-700">Recent Logs</h3>
        <button
          onClick={onToggleShowAll}
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
                const logType = stoolTypes.find((type) => type.type === log.type);

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
                    <div className="font-extrabold text-gray-300 text-xs sm:text-sm">{getDayName(log.occurred_at)}</div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </section>

    {acceptedFriendsCount > 0 && (
      <section className="animate-slide-up" style={{ animationDelay: '350ms' }}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base sm:text-lg font-extrabold text-gray-700">Friends' Logs</h3>
          <span className="text-[10px] sm:text-xs font-bold text-gray-400">{acceptedFriendsCount} friends</span>
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
                  const logType = stoolTypes.find((type) => type.type === log.type);
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
                          <div className="text-[10px] sm:text-xs font-bold text-gray-400">{friendName}</div>
                        </div>
                      </div>
                      <div className="font-extrabold text-gray-300 text-xs sm:text-sm">{getDayName(log.occurred_at)}</div>
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
);
