import React from 'react';

const AXES = [
  { key: 'spicy', label: '맵기' },
  { key: 'texture', label: '식감' },
  { key: 'saltiness', label: '염도' },
  { key: 'sweetness', label: '단맛' },
  { key: 'umami', label: '감칠맛' },
];

const CENTER = 50;
const OUTER_RADIUS = 30; // 목록 화면을 위해 반지름을 살짝 줄여 여백 확보 (34 -> 30)
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
  size = 200,
  showLabels = true,
  className = '',
}) => {
  const dataPoints = AXES.map((axis, index) =>
    getDataPoint(index, profile?.[axis.key] ?? 3),
  ).join(' ');

  return (
    <div className={className} style={{ width: size, height: size }}>
      {/* overflow-visible을 유지하여 라벨이 영역 밖으로 나가도 보이게 함 */}
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
        {/* 그리드 라인 */}
        {[1, 2, 3, 4, 5].map((level) => {
          const points = AXES.map((_, index) =>
            getPoint(index, (OUTER_RADIUS * level) / 5),
          ).join(' ');
          return (
            <polygon key={level} points={points} fill="none" stroke="#f1f5f9" strokeWidth="0.8" />
          );
        })}

        {/* 축 라인 */}
        {AXES.map((_, index) => {
          const [x, y] = getPoint(index, OUTER_RADIUS).split(',');
          return <line key={index} x1={CENTER} y1={CENTER} x2={x} y2={y} stroke="#f1f5f9" strokeWidth="0.8" />;
        })}

        {/* 데이터 영역 */}
        <polygon points={dataPoints} fill="rgba(240, 90, 40, 0.2)" stroke="#F05A28" strokeWidth="1.8" />

        {/* 맛 라벨 (목록용 최적화) */}
        {showLabels &&
          AXES.map((axis, index) => {
            const angle = (-90 + index * 72) * (Math.PI / 180);
            const labelRadius = OUTER_RADIUS + 12; // 라벨을 그래프에서 적당히 띄움
            const x = CENTER + labelRadius * Math.cos(angle);
            const y = CENTER + labelRadius * Math.sin(angle);

            return (
              <text
                key={axis.key}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="7" // 작은 카드에서도 잘 보이도록 크기 조정
                fontWeight="800"
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