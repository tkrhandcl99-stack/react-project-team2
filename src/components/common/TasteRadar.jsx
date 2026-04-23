import React from 'react';

const AXES = [
  { key: 'spicy', label: '맵기' },
  { key: 'texture', label: '식감' },
  { key: 'saltiness', label: '염도' },
  { key: 'sweetness', label: '단맛' },
  { key: 'umami', label: '감칠맛' },
];

const CENTER = 50;
const OUTER_RADIUS = 34;
const MAX_VALUE = 5;

const getPoint = (index, radius) => {
  const angle = (-90 + index * 72) * (Math.PI / 180);
  const x = CENTER + radius * Math.cos(angle);
  const y = CENTER + radius * Math.sin(angle);
  return `${x},${y}`;
};

const getDataPoint = (index, value) => {
  const normalized = Math.max(1, Math.min(MAX_VALUE, value)) / MAX_VALUE;
  const radius = OUTER_RADIUS * normalized;
  return getPoint(index, radius);
};

const TasteRadar = ({
  profile,
  size = 220,
  showLabels = true,
  className = '',
}) => {
  const dataPoints = AXES.map((axis, index) =>
    getDataPoint(index, profile?.[axis.key] ?? 3),
  ).join(' ');

  const outerPoints = AXES.map((_, index) =>
    getPoint(index, OUTER_RADIUS),
  ).join(' ');

  return (
    <div className={className} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
        {[1, 2, 3, 4, 5].map((level) => {
          const points = AXES.map((_, index) =>
            getPoint(index, (OUTER_RADIUS * level) / 5),
          ).join(' ');

          return (
            <polygon
              key={level}
              points={points}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="0.8"
            />
          );
        })}

        {AXES.map((_, index) => {
          const [x, y] = getPoint(index, OUTER_RADIUS).split(',');
          return (
            <line
              key={index}
              x1={CENTER}
              y1={CENTER}
              x2={x}
              y2={y}
              stroke="#ececec"
              strokeWidth="0.8"
            />
          );
        })}

        <polygon
          points={outerPoints}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="1"
        />

        <polygon
          points={dataPoints}
          fill="rgba(240, 90, 40, 0.18)"
          stroke="#F05A28"
          strokeWidth="1.8"
        />

        {AXES.map((axis, index) => {
          const value = profile?.[axis.key] ?? 3;
          const [x, y] = getDataPoint(index, value).split(',');

          return <circle key={axis.key} cx={x} cy={y} r="1.8" fill="#F05A28" />;
        })}

        {showLabels &&
          AXES.map((axis, index) => {
            const angle = (-90 + index * 72) * (Math.PI / 180);
            const labelRadius = OUTER_RADIUS + 8;
            const x = CENTER + labelRadius * Math.cos(angle);
            const y = CENTER + labelRadius * Math.sin(angle);

            return (
              <text
                key={axis.key}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="4.5"
                fontWeight="700"
                fill="#F05A28"
              >
                {axis.label}
              </text>
            );
          })}
      </svg>
    </div>
  );
};

export default TasteRadar;
