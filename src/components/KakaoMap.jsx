import React, { useState } from 'react';
import { LocateFixed } from 'lucide-react';
import SearchBar from './SearchBar';
import MapControls from './MapControls';
import PlaceDetailCard from './PlaceDetailCard';
import useKakaoMap from '../hooks/useKakaoMap';
import usePlaceImage from '../hooks/usePlaceImage';
import usePlaceSearch from '../hooks/usePlaceSearch';
import useCurrentLocation from '../hooks/useCurrentLocation';

const KakaoMap = ({ externalKeyword = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const { mapRef, isLoaded } = useKakaoMap(isExpanded);
  const { fetchPlaceImage } = usePlaceImage();

  const { selectedPlace, setSelectedPlace, handleSmartSearch, setKeyword } =
    usePlaceSearch({
      mapRef,
      isLoaded,
      fetchPlaceImage,
      externalKeyword,
    });

  const { moveToCurrentLocation } = useCurrentLocation(mapRef);

  return (
    <div
      className={`relative transition-all duration-500 shadow-lg overflow-hidden ${
        isExpanded
          ? 'fixed inset-0 z-[999] bg-white'
          : 'w-full h-80 rounded-3xl border-2 border-slate-100'
      }`}
    >
      <MapControls isExpanded={isExpanded} setIsExpanded={setIsExpanded} />

      <SearchBar
        onSearch={(val) => {
          setKeyword(val);
          handleSmartSearch(val);
        }}
      />

      <PlaceDetailCard
        place={selectedPlace}
        onClose={() => setSelectedPlace(null)}
      />

      <button
        onClick={moveToCurrentLocation}
        className="absolute bottom-4 right-4 z-[1002] w-11 h-11 rounded-full bg-white border border-slate-200 shadow-lg flex items-center justify-center text-red-500 hover:bg-red-50 active:scale-95 transition-all cursor-pointer"
        title="내 위치 찾기"
      >
        <LocateFixed size={20} />
      </button>

      <div
        id="map"
        style={{
          width: '100%',
          height: '100%',
          minHeight: isExpanded ? '100vh' : '320px',
        }}
      >
        {!isLoaded && (
          <div className="flex items-center justify-center h-full text-slate-400 animate-pulse">
            지도를 연결하는 중...
          </div>
        )}
      </div>
    </div>
  );
};

export default KakaoMap;
