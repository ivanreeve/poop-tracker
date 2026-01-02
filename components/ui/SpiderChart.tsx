type SpiderDatum = {
  label: string;
  value: number;
  emoji?: string;
};

type SpiderChartProps = {
  data: SpiderDatum[];
  levels?: number;
  className?: string;
};

const polarToCartesian = (center: number, radius: number, angleRad: number) => ({
  x: center + radius * Math.cos(angleRad),
  y: center + radius * Math.sin(angleRad),
});

export const SpiderChart = ({ data, levels = 4, className }: SpiderChartProps) => {
  const size = 200;
  const center = size / 2;
  const radius = 70;
  const safeLevels = Math.max(1, levels);
  const pointsCount = data.length;

  if (pointsCount === 0) {
    return (
      <div className={`flex items-center justify-center text-sm text-gray-400 ${className ?? ''}`}>
        No data yet
      </div>
    );
  }

  const angleStep = (Math.PI * 2) / pointsCount;
  const startAngle = -Math.PI / 2;

  const gridPolygons = Array.from({ length: safeLevels }, (_, levelIndex) => {
    const levelRatio = (levelIndex + 1) / safeLevels;
    const levelRadius = radius * levelRatio;
    const points = data
      .map((_, index) => {
        const angle = startAngle + index * angleStep;
        return polarToCartesian(center, levelRadius, angle);
      })
      .map((point) => `${point.x},${point.y}`)
      .join(' ');
    return { key: levelIndex, points };
  });

  const dataPoints = data
    .map((entry, index) => {
      const normalized = Math.min(Math.max(entry.value, 0), 100) / 100;
      const pointRadius = radius * normalized;
      const angle = startAngle + index * angleStep;
      return polarToCartesian(center, pointRadius, angle);
    })
    .map((point) => `${point.x},${point.y}`)
    .join(' ');

  const labelOffset = radius + 18;
  const labels = data.map((entry, index) => {
    const angle = startAngle + index * angleStep;
    const point = polarToCartesian(center, labelOffset, angle);
    const anchor = point.x < center - 2 ? 'end' : point.x > center + 2 ? 'start' : 'middle';
    return { ...entry, ...point, anchor };
  });

  return (
    <div className={`w-full h-full ${className ?? ''}`}>
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full" role="img" aria-label="Type distribution radar chart">
        {gridPolygons.map((polygon) => (
          <polygon
            key={polygon.key}
            points={polygon.points}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="1"
          />
        ))}
        {data.map((_, index) => {
          const angle = startAngle + index * angleStep;
          const axisPoint = polarToCartesian(center, radius, angle);
          return (
            <line
              key={`axis-${index}`}
              x1={center}
              y1={center}
              x2={axisPoint.x}
              y2={axisPoint.y}
              stroke="#E5E7EB"
              strokeWidth="1"
            />
          );
        })}
        <polygon points={dataPoints} fill="rgba(165, 93, 74, 0.25)" stroke="#A55D4A" strokeWidth="2" />
        {data
          .map((entry, index) => {
            const normalized = Math.min(Math.max(entry.value, 0), 100) / 100;
            const pointRadius = radius * normalized;
            const angle = startAngle + index * angleStep;
            const point = polarToCartesian(center, pointRadius, angle);
            return (
              <circle key={`point-${entry.label}`} cx={point.x} cy={point.y} r="3" fill="#A55D4A" />
            );
          })}
        {labels.map((label) => (
          <text
            key={`label-${label.label}`}
            x={label.x}
            y={label.y}
            textAnchor={label.anchor as 'start' | 'middle' | 'end'}
            className="fill-gray-500 text-[9px] sm:text-[10px] font-semibold"
          >
            {label.emoji ? `${label.emoji} ${label.label}` : label.label}
          </text>
        ))}
      </svg>
    </div>
  );
};
