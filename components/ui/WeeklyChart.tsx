import type { PoopLog } from '../../types/models';

export const WeeklyChart = ({ logs }: { logs: PoopLog[] }) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();

  const weekData = days.map((day, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    const count = logs.filter((log) => {
      const logDate = new Date(log.occurred_at);
      return logDate.toDateString() === date.toDateString();
    }).length;
    return { day, count, isToday: date.toDateString() === today.toDateString() };
  });

  const maxCount = Math.max(...weekData.map((data) => data.count), 1);

  return (
    <div className="flex items-end justify-between gap-1 sm:gap-2 h-24 sm:h-32 md:h-40">
      {weekData.map((data, index) => (
        <div key={data.day} className="flex-1 flex flex-col items-center gap-1 sm:gap-2">
          <div
            className={`w-full rounded-t-xl transition-all duration-500 ease-out ${
              data.isToday ? 'bg-[#FF8096]' : 'bg-[#A6D8D4]'
            }`}
            style={{
              height: `${(data.count / maxCount) * 100}%`,
              minHeight: data.count > 0 ? '12px' : '4px',
              animationDelay: `${index * 100}ms`,
            }}
          />
          <span className={`text-[10px] sm:text-xs font-bold ${data.isToday ? 'text-[#FF8096]' : 'text-gray-400'}`}>
            {data.day}
          </span>
        </div>
      ))}
    </div>
  );
};
