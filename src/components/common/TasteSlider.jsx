import React from 'react';

const TasteSlider = ({ item, value, summary, onChange }) => {
  const Icon = item.icon;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 font-semibold text-slate-800">
          <Icon size={18} className="text-[#F05A28]" />
          {item.label}
        </label>
        <span className="text-xs font-bold text-[#F05A28] bg-orange-50 px-3 py-1 rounded-full">
          {summary}
        </span>
      </div>

      <input
        type="range"
        min="1"
        max="5"
        step="1"
        value={value}
        onChange={(e) => onChange(item.key, e.target.value)}
        className="w-full accent-[#F05A28] cursor-pointer"
      />

      <div className="flex justify-between text-[11px] text-slate-400 px-1">
        <span>{item.left}</span>
        <span>{item.right}</span>
      </div>
    </div>
  );
};

export default TasteSlider;
