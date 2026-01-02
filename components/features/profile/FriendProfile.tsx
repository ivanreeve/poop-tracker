import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import type { PoopLog, Profile, StoolType } from '../../../types/models';
import { Statistics } from '../statistics/Statistics';
import { getDayName } from '../../../lib/calculations';
import { useStats } from '../../../hooks/useStats';
import { JuicyButton } from '../../ui/JuicyButton';
import { LogCardSkeleton } from '../../ui/skeleton';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '../../ui/avatar';

type FriendProfileProps = {
  friendProfile: Profile | null;
  friendLogs: PoopLog[];
  stoolTypes: StoolType[];
  loading: boolean;
  onBack: () => void;
};

export const FriendProfile = ({
  friendProfile,
  friendLogs,
  stoolTypes,
  loading,
  onBack,
}: FriendProfileProps) => {
  const stats = useStats(friendLogs);
  const friendName = friendProfile?.full_name || friendProfile?.email || 'Friend';
  const cardWidth = 120;
  const [recentPage, setRecentPage] = useState(1);
  const [recentRowCapacity, setRecentRowCapacity] = useState(4);
  const recentGridRef = useRef<HTMLDivElement | null>(null);
  const totalRecentPages = Math.max(1, Math.ceil(friendLogs.length / recentRowCapacity));
  const recentLogsToShow = friendLogs.slice((recentPage - 1) * recentRowCapacity, recentPage * recentRowCapacity);

  useEffect(() => {
    if (recentPage > totalRecentPages) {
      setRecentPage(totalRecentPages);
    }
  }, [recentPage, totalRecentPages]);

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
    if (!recentElement) return;

    const observer = new ResizeObserver(() => {
      updateCapacity(recentElement, setRecentRowCapacity);
    });

    observer.observe(recentElement);
    updateCapacity(recentElement, setRecentRowCapacity);

    return () => observer.disconnect();
  }, [cardWidth, loading]);

  return (
    <>
      <div className="mb-4">
        <JuicyButton variant="coral" size="sm" onClick={onBack}>
          <ArrowLeft size={16} />
          BACK TO PROFILE
        </JuicyButton>
      </div>

      <section className="bg-white rounded-md p-4 sm:p-6 lg:p-4 border-2">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 rounded-full bg-[#F0F8FF] border-2 border-[#E8F4F3]">
            {friendProfile?.avatar_url && <AvatarImage src={friendProfile.avatar_url} alt={friendName} />}
            <AvatarFallback className="rounded-full bg-[#F0F8FF]">
              <Users size={24} className="text-[#A6D8D4]" />
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="text-lg sm:text-xl font-extrabold text-gray-700">{friendName}</div>
            <div className="text-xs sm:text-sm font-bold text-gray-400">{friendProfile?.email || 'Friend'}</div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[var(--flo-pink-dark)]">
            Recent Logs
          </h2>
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
        {loading ? (
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
                      className="log-card relative bg-[#fcf6f4] p-3 sm:p-4 rounded-md border-2 border-[#ead2cb] flex flex-col items-center text-center gap-1 sm:gap-2 transition-transform duration-100 cursor-pointer flex-shrink-0 w-[120px]"
                    >
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

      <Statistics
        userLogs={friendLogs}
        stoolTypes={stoolTypes}
        streak={stats.streak}
        avgTypeDisplay={stats.avgTypeDisplay}
        healthScoreDisplay={stats.healthScoreDisplay}
        timePeriodStats={stats.timePeriodStats}
        loading={loading}
      />
    </>
  );
};
