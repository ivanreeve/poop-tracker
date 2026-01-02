import { useEffect, useRef, useState } from 'react';
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
  const cardWidth = 120;
  const logsPerPage = 8;
  const friendLogsPerPage = 6;
  const [recentPage, setRecentPage] = useState(1);
  const [showAllFriendLogs, setShowAllFriendLogs] = useState(false);
  const [friendPage, setFriendPage] = useState(1);
  const [recentRowCapacity, setRecentRowCapacity] = useState(4);
  const [friendRowCapacity, setFriendRowCapacity] = useState(4);
  const recentGridRef = useRef<HTMLDivElement | null>(null);
  const friendGridRef = useRef<HTMLDivElement | null>(null);
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
  const totalRecentPages = showAllLogs ? Math.max(1, Math.ceil(userLogs.length / logsPerPage)) : 1;
  const totalFriendPages = showAllFriendLogs ? Math.max(1, Math.ceil(friendLogs.length / friendLogsPerPage)) : 1;
  const shouldShowAllRecent = userLogs.length > 0 && userLogs.length >= recentRowCapacity;
  const shouldShowAllFriends = friendLogs.length > 0 && friendLogs.length >= friendRowCapacity;
  const recentLogsToShow = showAllLogs
    ? userLogs.slice((recentPage - 1) * logsPerPage, recentPage * logsPerPage)
    : userLogs.slice(0, recentRowCapacity);
  const friendLogsToShow = showAllFriendLogs
    ? friendLogs.slice((friendPage - 1) * friendLogsPerPage, friendPage * friendLogsPerPage)
    : friendLogs.slice(0, friendRowCapacity);

  useEffect(() => {
    if (!showAllLogs) {
      setRecentPage(1);
    }
  }, [showAllLogs]);

  useEffect(() => {
    if (!showAllFriendLogs) {
      setFriendPage(1);
    }
  }, [showAllFriendLogs]);

  useEffect(() => {
    if (showAllLogs && !shouldShowAllRecent) {
      onToggleShowAll();
    }
  }, [onToggleShowAll, shouldShowAllRecent, showAllLogs]);

  useEffect(() => {
    if (showAllFriendLogs && !shouldShowAllFriends) {
      setShowAllFriendLogs(false);
    }
  }, [shouldShowAllFriends, showAllFriendLogs]);

  useEffect(() => {
    if (!showAllLogs) return;
    if (recentPage > totalRecentPages) {
      setRecentPage(totalRecentPages);
    }
  }, [recentPage, showAllLogs, totalRecentPages]);

  useEffect(() => {
    if (!showAllFriendLogs) return;
    if (friendPage > totalFriendPages) {
      setFriendPage(totalFriendPages);
    }
  }, [friendPage, showAllFriendLogs, totalFriendPages]);

  useEffect(() => {
    const updateCapacity = (element: HTMLDivElement | null, setter: (value: number) => void) => {
      if (!element) return;
      const styles = getComputedStyle(element);
      const templateColumns = styles.gridTemplateColumns;
      const columnCount = templateColumns && templateColumns !== 'none'
        ? templateColumns.trim().split(/\s+/).length
        : 0;
      if (columnCount > 0) {
        setter(columnCount);
        return;
      }
      const gapValue = parseFloat(styles.columnGap || styles.gap || '0');
      const width = element.clientWidth;
      if (!width) return;
      const capacity = Math.max(1, Math.floor((width + gapValue) / (cardWidth + gapValue)));
      setter(capacity);
    };

    const recentElement = recentGridRef.current;
    const friendElement = friendGridRef.current;
    if (!recentElement && !friendElement) return;

    const observer = new ResizeObserver(() => {
      updateCapacity(recentElement, setRecentRowCapacity);
      updateCapacity(friendElement, setFriendRowCapacity);
    });

    if (recentElement) observer.observe(recentElement);
    if (friendElement) observer.observe(friendElement);

    updateCapacity(recentElement, setRecentRowCapacity);
    updateCapacity(friendElement, setFriendRowCapacity);

    return () => observer.disconnect();
  }, [cardWidth]);

  return (
    <>
      <section className="relative min-h-[380px] sm:min-h-[420px] lg:min-h-[480px] -mx-4 sm:-mx-6 lg:-mx-8 xl:-mx-10 -mt-4 sm:-mt-6 lg:-mt-8 xl:-mt-10 overflow-hidden bg-gradient-to-b from-[var(--flo-pink-dark)] to-[var(--flo-pink)] rounded-none p-5 sm:p-6 lg:p-8 text-white shadow-lg flex flex-col">
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

        <div className="flex-1 flex flex-col items-center justify-center text-center mt-14 sm:mt-16 pb-10 sm:pb-12">
          <p className="text-lg sm:text-xl font-bold">You Pooped</p>
          <p className="mt-2 text-6xl sm:text-7xl lg:text-8xl font-black text-[#d9d9d9]">{todayCount}</p>
          <p className="mt-2 text-sm sm:text-base font-semibold text-white/80">Times Today</p>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base sm:text-lg font-extrabold text-gray-700">Recent Logs</h3>
          {shouldShowAllRecent && (
            <button
              onClick={onToggleShowAll}
              className="cursor-pointer text-[#5c1916] font-bold text-xs sm:text-sm hover:underline transition-all"
            >
              {showAllLogs ? 'VIEW LESS' : 'VIEW ALL'}
            </button>
          )}
        </div>
        {logsLoading ? (
          <div
            ref={recentGridRef}
            className="grid grid-cols-[repeat(auto-fill,minmax(120px,120px))] justify-start gap-2 sm:gap-3 stagger-children"
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <LogCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            {recentLogsToShow.length === 0 ? (
              <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-6 text-center text-xs sm:text-sm font-bold text-gray-400">
                No logs yet. Tap &quot;LOG NOW&quot; to add your first entry.
              </div>
            ) : (
              <div
                ref={recentGridRef}
                className="grid grid-cols-[repeat(auto-fill,minmax(120px,120px))] justify-start gap-2 sm:gap-3"
              >
                {recentLogsToShow.map((log) => {
                  const logType = stoolTypes.find((type) => type.type === log.type);

                  return (
                    <div
                      key={log.id}
                      className="bg-white p-3 sm:p-4 rounded-2xl border-2 border-gray-200 flex flex-col items-center text-center gap-1 sm:gap-2"
                    >
                      <div className="text-3xl sm:text-4xl md:text-5xl filter drop-shadow-sm">{logType?.emoji}</div>
                      <div className="font-bold text-gray-700 text-sm sm:text-base">{logType?.label}</div>
                      <div className="text-[10px] sm:text-xs font-bold text-gray-400">
                        {new Date(log.occurred_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="font-extrabold text-gray-300 text-[10px] sm:text-xs">{getDayName(log.occurred_at)}</div>
                    </div>
                  );
                })}
              </div>
            )}
            {showAllLogs && totalRecentPages > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <button
                  onClick={() => setRecentPage((prev) => Math.max(1, prev - 1))}
                  disabled={recentPage === 1}
                  className="text-xs sm:text-sm font-bold text-[#5c1916] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  PREV
                </button>
                <span className="text-[10px] sm:text-xs font-bold text-gray-400">
                  Page {recentPage} of {totalRecentPages}
                </span>
                <button
                  onClick={() => setRecentPage((prev) => Math.min(totalRecentPages, prev + 1))}
                  disabled={recentPage === totalRecentPages}
                  className="text-xs sm:text-sm font-bold text-[#5c1916] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  NEXT
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {acceptedFriendsCount > 0 && (
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base sm:text-lg font-extrabold text-gray-700">Friends&apos; Logs</h3>
          <div className="flex items-center gap-3">
            <span className="text-[10px] sm:text-xs font-bold text-gray-400">{acceptedFriendsCount} friends</span>
            {shouldShowAllFriends && (
              <button
                onClick={() => setShowAllFriendLogs((prev) => !prev)}
                className="cursor-pointer text-[#5c1916] font-bold text-xs sm:text-sm hover:underline transition-all"
              >
                {showAllFriendLogs ? 'VIEW LESS' : 'VIEW ALL'}
              </button>
            )}
          </div>
        </div>
        {friendsLoading ? (
          <div
            ref={friendGridRef}
            className="grid grid-cols-[repeat(auto-fill,minmax(120px,120px))] justify-start gap-2 sm:gap-3"
          >
            {Array.from({ length: 3 }).map((_, i) => (
              <LogCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            {friendLogsToShow.length === 0 ? (
              <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-6 text-center text-xs sm:text-sm font-bold text-gray-400">
                No friend logs yet. Invite friends to start sharing.
              </div>
            ) : (
              <div
                ref={friendGridRef}
                className="grid grid-cols-[repeat(auto-fill,minmax(120px,120px))] justify-start gap-2 sm:gap-3"
              >
                {friendLogsToShow.map((log) => {
                  const logType = stoolTypes.find((type) => type.type === log.type);
                  const friendProfile = profilesById[log.user_id];
                  const friendName = friendProfile?.full_name || friendProfile?.email || 'Friend';

                  return (
                    <div
                      key={log.id}
                      className="bg-white p-3 sm:p-4 rounded-2xl border-2 border-gray-200 flex flex-col items-center text-center gap-1 sm:gap-2"
                    >
                      <div className="text-3xl sm:text-4xl md:text-5xl filter drop-shadow-sm">{logType?.emoji}</div>
                      <div className="font-bold text-gray-700 text-sm sm:text-base">{logType?.label}</div>
                      <div className="text-[10px] sm:text-xs font-bold text-gray-400">{friendName}</div>
                      <div className="text-[10px] sm:text-xs font-bold text-gray-400">
                        {new Date(log.occurred_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="font-extrabold text-gray-300 text-[10px] sm:text-xs">
                        {getDayName(log.occurred_at)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {showAllFriendLogs && totalFriendPages > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <button
                  onClick={() => setFriendPage((prev) => Math.max(1, prev - 1))}
                  disabled={friendPage === 1}
                  className="text-xs sm:text-sm font-bold text-[#5c1916] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  PREV
                </button>
                <span className="text-[10px] sm:text-xs font-bold text-gray-400">
                  Page {friendPage} of {totalFriendPages}
                </span>
                <button
                  onClick={() => setFriendPage((prev) => Math.min(totalFriendPages, prev + 1))}
                  disabled={friendPage === totalFriendPages}
                  className="text-xs sm:text-sm font-bold text-[#5c1916] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  NEXT
                </button>
              </div>
            )}
          </>
        )}
      </section>
    )}
  </>
);
};
