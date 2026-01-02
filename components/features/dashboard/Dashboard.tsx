import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Minus } from 'lucide-react';
import type { PoopLog, Profile, StoolType } from '../../../types/models';
import { getDayName } from '../../../lib/calculations';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { JuicyButton } from '../../ui/JuicyButton';
import { LogCardSkeleton } from '../../ui/skeleton';

type DashboardProps = {
  greetingName: string;
  profile: Profile | null;
  userLogs: PoopLog[];
  visibleLogs: PoopLog[];
  showAllLogs: boolean;
  onToggleShowAll: () => void;
  logsLoading: boolean;
  onDeleteLog: (id: string) => Promise<boolean>;
  onRestoreLog: (log: PoopLog) => Promise<boolean>;
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
  logsLoading,
  onDeleteLog,
  onRestoreLog,
  stoolTypes,
  friendLogs,
  acceptedFriendsCount,
  friendsLoading,
  profilesById,
}: DashboardProps) => {
  const cardWidth = 120;
  const [recentPage, setRecentPage] = useState(1);
  const [friendPage, setFriendPage] = useState(1);
  const [recentRowCapacity, setRecentRowCapacity] = useState(4);
  const [friendRowCapacity, setFriendRowCapacity] = useState(4);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deletedLog, setDeletedLog] = useState<PoopLog | null>(null);
  const [pendingDeleteLog, setPendingDeleteLog] = useState<PoopLog | null>(null);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
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
  const formattedDate = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const dayLabels = ['M', 'T', 'W', 'TH', 'F', 'S', 'SU'];
  const avatarInitial = greetingName.trim().charAt(0).toUpperCase();
  const totalRecentPages = Math.max(1, Math.ceil(userLogs.length / recentRowCapacity));
  const totalFriendPages = Math.max(1, Math.ceil(friendLogs.length / friendRowCapacity));
  const recentLogsToShow = userLogs.slice((recentPage - 1) * recentRowCapacity, recentPage * recentRowCapacity);
  const friendLogsToShow = friendLogs.slice((friendPage - 1) * friendRowCapacity, friendPage * friendRowCapacity);

  useEffect(() => {
    if (recentPage > totalRecentPages) {
      setRecentPage(totalRecentPages);
    }
  }, [recentPage, totalRecentPages]);

  useEffect(() => {
    if (friendPage > totalFriendPages) {
      setFriendPage(totalFriendPages);
    }
  }, [friendPage, totalFriendPages]);

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
  }, [cardWidth, logsLoading, friendsLoading]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (isEditMode) {
        // If clicking on something that isn't a delete button or a log card, exit edit mode
        const target = e.target as HTMLElement;
        if (!target.closest('.log-card') && !target.closest('.delete-btn')) {
          setIsEditMode(false);
        }
      }
    };

    if (isEditMode) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isEditMode]);

  const handleTouchStart = () => {
    pressTimer.current = setTimeout(() => {
      setIsEditMode(true);
      // Haptic feedback if available
      if (navigator.vibrate) navigator.vibrate(50);
    }, 500);
  };

  const handleTouchEnd = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }
  };

  const handleDelete = async (log: PoopLog) => {
    // Optimistic delete happens in parent, but we handle the Undo UI here
    setDeletedLog(log);
    await onDeleteLog(log.id);
    
    // Clear snackbar after 4 seconds
    setTimeout(() => {
      setDeletedLog((current) => (current?.id === log.id ? null : current));
    }, 4000);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDeleteLog) return;
    const logToDelete = pendingDeleteLog;
    setPendingDeleteLog(null);
    await handleDelete(logToDelete);
  };

  const handleUndo = async () => {
    if (deletedLog) {
      await onRestoreLog(deletedLog);
      setDeletedLog(null);
    }
  };

  return (
    <>
      <section
        className="relative min-h-[380px] sm:min-h-[420px] lg:min-h-[480px] -mx-4 sm:-mx-6 lg:-mx-8 xl:-mx-10 -mt-4 sm:-mt-6 lg:-mt-8 xl:-mt-10 overflow-hidden bg-gradient-to-b from-[var(--flo-pink-dark)] to-[var(--flo-pink)] rounded-none p-5 sm:p-6 lg:p-8 text-white flex flex-col"
        style={{
          boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.35), 0 18px 40px rgba(92, 25, 22, 0.35)',
        }}
      >
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
          <div className="flex items-center gap-2">
            <JuicyButton
              variant="secondary"
              size="sm"
              onClick={() => setRecentPage((prev) => Math.max(1, prev - 1))}
              disabled={recentPage === 1}
              className="px-2.5 py-0.5 h-7 text-[10px] sm:text-xs bg-[var(--flo-pink)] hover:bg-[var(--flo-pink)] text-white gap-1 border-[var(--flo-pink-dark)] border-b-[3px]"
              aria-label="Previous recent logs"
            >
              <ChevronLeft size={14} strokeWidth={3} />
              <span className="text-[10px] sm:text-xs font-black tracking-wide">PREV</span>
            </JuicyButton>
            <JuicyButton
              variant="secondary"
              size="sm"
              onClick={() => setRecentPage((prev) => Math.min(totalRecentPages, prev + 1))}
              disabled={recentPage === totalRecentPages}
              className="px-2.5 py-0.5 h-7 text-[10px] sm:text-xs bg-[var(--flo-pink)] hover:bg-[var(--flo-pink)] text-white gap-1 border-[var(--flo-pink-dark)] border-b-[3px]"
              aria-label="Next recent logs"
            >
              <span className="text-[10px] sm:text-xs font-black tracking-wide">NEXT</span>
              <ChevronRight size={14} strokeWidth={3} />
            </JuicyButton>
          </div>
        </div>
        {logsLoading ? (
          <div
            ref={recentGridRef}
            className="flex flex-row justify-start gap-2 sm:gap-3 stagger-children py-4"
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-[120px]">
                <LogCardSkeleton />
              </div>
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
                className="flex flex-row justify-start gap-2 sm:gap-3 py-4"
              >
                {recentLogsToShow.map((log, index) => {
                  const logType = stoolTypes.find((type) => type.type === log.type);

                  return (
                    <div
                      key={log.id}
                      style={{ zIndex: recentLogsToShow.length - index }}
                      className={`log-card relative bg-[#fcf6f4] p-3 sm:p-4 rounded-md border-2 border-[#ead2cb] flex flex-col items-center text-center gap-1 sm:gap-2 transition-transform duration-100 cursor-pointer flex-shrink-0 w-[120px] ${
                        isEditMode ? 'animate-shake' : ''
                      }`}
                      onTouchStart={handleTouchStart}
                      onTouchEnd={handleTouchEnd}
                      onMouseDown={handleTouchStart}
                      onMouseUp={handleTouchEnd}
                      onMouseLeave={handleTouchEnd}
                    >
                      {isEditMode && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPendingDeleteLog(log);
                          }}
                          className="delete-btn absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors z-10 animate-bounce-in"
                          aria-label="Delete log"
                        >
                          <Minus size={16} strokeWidth={3} />
                        </button>
                      )}
                      <div className="text-3xl sm:text-4xl md:text-5xl filter drop-shadow-sm">{logType?.emoji}</div>
                      <div className="font-bold text-[#5c1916] text-sm sm:text-base">{logType?.label}</div>
                      <div className="text-[10px] sm:text-xs font-bold text-[#8a5d55]">
                        {new Date(log.occurred_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="font-extrabold text-[#cbb0a8] text-[10px] sm:text-xs">{getDayName(log.occurred_at)}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </section>

      {/* Snackbar */}
      {pendingDeleteLog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-log-title"
          onClick={() => setPendingDeleteLog(null)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-[#ead2cb]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-4">
              <h2 id="delete-log-title" className="text-lg font-black text-gray-700 text-center">
                Delete log?
              </h2>
            </div>
            <div className="p-4 text-center">
              <p className="text-sm font-semibold text-gray-500">
                Are you sure you want to delete this log?
              </p>
            </div>
            <div className="p-4 pt-2 flex gap-2">
              <JuicyButton
                variant="outline"
                size="md"
                fullWidth
                onClick={() => setPendingDeleteLog(null)}
                className="bg-[#e5e5e5] border-[#cfcfcf] text-[#6b6b6b] hover:bg-[#dcdcdc]"
              >
                Cancel
              </JuicyButton>
              <JuicyButton
                variant="primary"
                size="md"
                fullWidth
                onClick={handleConfirmDelete}
                className="bg-red-500 border-red-700 hover:bg-red-600"
              >
                Delete
              </JuicyButton>
            </div>
          </div>
        </div>
      )}
      <div
        className={`fixed bottom-28 left-1/2 transform -translate-x-1/2 bg-white text-slate-800 border-2 border-gray-100 px-4 py-3 rounded-xl shadow-xl flex items-center gap-4 z-50 transition-opacity duration-300 ${
          deletedLog ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <span className="text-sm font-bold">Log deleted</span>
        <JuicyButton
          variant="coral"
          size="sm"
          onClick={handleUndo}
          className="h-8 px-3 py-0 text-xs"
        >
          UNDO
        </JuicyButton>
      </div>

      {acceptedFriendsCount > 0 && (
      <section>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-gray-700">Friends&apos; Logs</h3>
            <span className="text-[10px] sm:text-xs font-bold text-gray-400">{acceptedFriendsCount} friends</span>
          </div>
          <div className="flex items-center gap-2">
            <JuicyButton
              variant="secondary"
              size="sm"
              onClick={() => setFriendPage((prev) => Math.max(1, prev - 1))}
              disabled={friendPage === 1}
              className="px-2.5 py-0.5 h-7 text-[10px] sm:text-xs bg-[var(--flo-pink)] hover:bg-[var(--flo-pink)] text-white gap-1 border-[var(--flo-pink-dark)] border-b-[3px]"
              aria-label="Previous friends logs"
            >
              <ChevronLeft size={14} strokeWidth={3} />
              <span className="text-[10px] sm:text-xs font-black tracking-wide">PREV</span>
            </JuicyButton>
            <JuicyButton
              variant="secondary"
              size="sm"
              onClick={() => setFriendPage((prev) => Math.min(totalFriendPages, prev + 1))}
              disabled={friendPage === totalFriendPages}
              className="px-2.5 py-0.5 h-7 text-[10px] sm:text-xs bg-[var(--flo-pink)] hover:bg-[var(--flo-pink)] text-white gap-1 border-[var(--flo-pink-dark)] border-b-[3px]"
              aria-label="Next friends logs"
            >
              <span className="text-[10px] sm:text-xs font-black tracking-wide">NEXT</span>
              <ChevronRight size={14} strokeWidth={3} />
            </JuicyButton>
          </div>
        </div>
        {friendsLoading ? (
          <div
            ref={friendGridRef}
            className="flex flex-row justify-start gap-2 sm:gap-3 py-4"
          >
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-[120px]">
                <LogCardSkeleton />
              </div>
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
                className="flex flex-row justify-start gap-2 sm:gap-3 py-4"
              >
                {friendLogsToShow.map((log, index) => {
                  const logType = stoolTypes.find((type) => type.type === log.type);
                  const friendProfile = profilesById[log.user_id];
                  const friendName = friendProfile?.full_name || friendProfile?.email || 'Friend';

                  return (
                    <div
                      key={log.id}
                      style={{ zIndex: friendLogsToShow.length - index }}
                      className="bg-[#fcf6f4] p-3 sm:p-4 rounded-md border-2 border-[#ead2cb] flex flex-col items-center text-center gap-1 sm:gap-2 flex-shrink-0 w-[120px]"
                    >
                      <div className="text-3xl sm:text-4xl md:text-5xl filter drop-shadow-sm">{logType?.emoji}</div>
                      <div className="font-bold text-[#5c1916] text-sm sm:text-base">{logType?.label}</div>
                      <div className="text-[10px] sm:text-xs font-bold text-[#8a5d55]">{friendName}</div>
                      <div className="text-[10px] sm:text-xs font-bold text-[#8a5d55]">
                        {new Date(log.occurred_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="font-extrabold text-[#cbb0a8] text-[10px] sm:text-xs">
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
);
};
