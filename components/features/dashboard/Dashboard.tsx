import type { PoopLog, Profile, StoolType } from '../../../types/models';
import { getDayName } from '../../../lib/calculations';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { LogCardSkeleton } from '../../ui/skeleton';

type DashboardProps = {
  greetingName: string;
  profile: Profile | null;
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
  profile,
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
}: DashboardProps) => {
  const today = new Date();
  const todayKey = today.toDateString();
  const todayCount = userLogs.filter((log) => new Date(log.occurred_at).toDateString() === todayKey).length;
  const startOfWeek = new Date(today);
  const dayIndex = startOfWeek.getDay();
  const offsetToMonday = dayIndex === 0 ? -6 : 1 - dayIndex;
  startOfWeek.setDate(today.getDate() + offsetToMonday);
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return date;
  });
  const formattedDate = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  const dayLabels = ['M', 'T', 'W', 'TH', 'F', 'S', 'SU'];
  const avatarInitial = greetingName.trim().charAt(0).toUpperCase();

  return (
    <>
      <section className="relative min-h-[320px] sm:min-h-[360px] lg:min-h-[420px] -mx-4 sm:-mx-6 lg:-mx-8 xl:-mx-10 -mt-4 sm:-mt-6 lg:-mt-8 xl:-mt-10 overflow-hidden bg-gradient-to-b from-[var(--flo-pink-dark)] to-[var(--flo-pink)] rounded-none p-5 sm:p-6 lg:p-8 text-white shadow-lg flex flex-col">
        <div className="space-y-4 sm:space-y-5">
          <div className="grid grid-cols-7 items-center gap-2 sm:gap-3">
            <div className="flex items-center justify-center">
              <Avatar
                className="h-8 w-8 sm:h-9 sm:w-9 border-2 border-white/80 bg-white/90"
                aria-label={greetingName}
              >
                {profile?.avatar_url && <AvatarImage src={profile.avatar_url} alt={greetingName} />}
                <AvatarFallback className="bg-white/90 text-[#5c1916] text-[10px] sm:text-xs font-bold">
                  {avatarInitial}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="col-span-5 text-center text-sm sm:text-base font-bold">{formattedDate}</div>
          </div>

          <div className="grid grid-cols-7 gap-2 sm:gap-3 text-center mt-6 sm:mt-7">
            {weekDates.map((date, index) => {
              const isToday = date.toDateString() === todayKey;
              const dayLabel = dayLabels[index];
              return (
                <div key={date.toISOString()} className="flex flex-col items-center gap-1">
                  <span className="text-[10px] sm:text-xs font-semibold text-white/70">
                    {isToday ? 'Today' : dayLabel}
                  </span>
                  <div
                    className={`flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-full ${
                      isToday ? 'bg-[#ead2cb] border-2 border-white/70 shadow-sm' : ''
                    }`}
                  >
                    <span className={`text-base sm:text-lg font-bold ${isToday ? 'text-[#5c1916]' : 'text-white'}`}>
                      {date.getDate()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <p className="text-lg sm:text-xl font-bold">You Pooped</p>
          <p className="mt-2 text-6xl sm:text-7xl lg:text-8xl font-black text-[#d9d9d9]">{todayCount}</p>
          <p className="mt-2 text-sm sm:text-base font-semibold text-white/80">Times Today</p>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base sm:text-lg font-extrabold text-gray-700">Recent Logs</h3>
          <button
            onClick={onToggleShowAll}
            disabled={userLogs.length <= 4}
            className="cursor-pointer text-[#5c1916] font-bold text-xs sm:text-sm hover:underline transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {showAllLogs ? 'VIEW LESS' : 'VIEW ALL'}
          </button>
        </div>
        {logsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 stagger-children">
            {Array.from({ length: 4 }).map((_, i) => (
              <LogCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            {visibleLogs.length === 0 ? (
              <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-6 text-center text-xs sm:text-sm font-bold text-gray-400">
                No logs yet. Tap &quot;LOG NOW&quot; to add your first entry.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
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
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base sm:text-lg font-extrabold text-gray-700">Friends&apos; Logs</h3>
          <span className="text-[10px] sm:text-xs font-bold text-gray-400">{acceptedFriendsCount} friends</span>
        </div>
        {friendsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <LogCardSkeleton key={i} />
            ))}
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
};
