import React from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

const MapControls = ({ isExpanded, setIsExpanded }) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        setIsExpanded(!isExpanded);
      }}
      className="absolute top-4 left-4 z-[1000] p-2.5 bg-[#F05A28] text-white shadow-xl rounded-full active:scale-90 transition-transform"
    >
      {isExpanded ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
    </button>
  );
};

export default MapControls;
