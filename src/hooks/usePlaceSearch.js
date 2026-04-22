import { useEffect, useState } from 'react';

const usePlaceSearch = ({
  mapRef,
  isLoaded,
  fetchPlaceImage,
  externalKeyword,
}) => {
  const [keyword, setKeyword] = useState('식당');
  const [markers, setMarkers] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const clearStoreMarkers = () => {
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);
  };

  const createStoreMarkers = (places) => {
    if (!mapRef.current || !places.length) return;

    clearStoreMarkers();

    const newMarkers = [];
    const bounds = new window.kakao.maps.LatLngBounds();

    places.forEach((place) => {
      const position = new window.kakao.maps.LatLng(place.y, place.x);

      const marker = new window.kakao.maps.Marker({
        map: mapRef.current,
        position,
      });

      window.kakao.maps.event.addListener(marker, 'click', async () => {
        setSelectedPlace({
          ...place,
          imageUrl: null,
          isImageLoading: true,
        });

        const imageUrl = await fetchPlaceImage(place.place_url);

        setSelectedPlace({
          ...place,
          imageUrl,
          isImageLoading: false,
        });
      });

      newMarkers.push(marker);
      bounds.extend(position);
    });

    setMarkers(newMarkers);
    mapRef.current.setBounds(bounds);
  };

  const parseSearchInput = (input) => {
    const text = input.trim();

    if (!text) {
      return {
        locationKeyword: '',
        placeKeyword: '식당',
      };
    }

    const parts = text.split(/\s+/);

    if (parts.length === 1) {
      return {
        locationKeyword: '',
        placeKeyword: text,
      };
    }

    return {
      locationKeyword: parts.slice(0, -1).join(' '),
      placeKeyword: parts[parts.length - 1],
    };
  };

  const searchNearbyPlaces = (center, placeKeyword) => {
    if (!mapRef.current) return;

    const ps = new window.kakao.maps.services.Places();

    ps.keywordSearch(
      placeKeyword,
      (data, status) => {
        if (status !== window.kakao.maps.services.Status.OK || !data.length) {
          alert('주변에서 검색 결과를 찾지 못했습니다.');
          return;
        }

        mapRef.current.setCenter(center);
        createStoreMarkers(data);
      },
      {
        location: center,
        radius: 2000,
        size: 15,
      },
    );
  };

  const searchByLocationAndKeyword = (locationKeyword, placeKeyword) => {
    const ps = new window.kakao.maps.services.Places();

    ps.keywordSearch(locationKeyword, (locationData, locationStatus) => {
      if (
        locationStatus !== window.kakao.maps.services.Status.OK ||
        !locationData.length
      ) {
        alert('입력한 위치를 찾지 못했습니다.');
        return;
      }

      const target = locationData[0];
      const center = new window.kakao.maps.LatLng(target.y, target.x);

      mapRef.current.setCenter(center);
      searchNearbyPlaces(center, placeKeyword);
    });
  };

  const handleSmartSearch = (input) => {
    if (!mapRef.current) return;

    setSelectedPlace(null);

    const { locationKeyword, placeKeyword } = parseSearchInput(input);

    if (locationKeyword && placeKeyword) {
      searchByLocationAndKeyword(locationKeyword, placeKeyword);
      return;
    }

    const currentCenter = mapRef.current.getCenter();
    searchNearbyPlaces(currentCenter, placeKeyword);
  };

  useEffect(() => {
    if (!mapRef.current || !isLoaded) return;

    const ps = new window.kakao.maps.services.Places();

    ps.keywordSearch(
      keyword,
      (data, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          createStoreMarkers(data);
        }
      },
      {
        location: mapRef.current.getCenter(),
        radius: 2000,
        size: 15,
      },
    );
  }, [keyword, isLoaded]);

  useEffect(() => {
    if (externalKeyword && externalKeyword.trim()) {
      setKeyword(externalKeyword);
      setSelectedPlace(null);
      handleSmartSearch(externalKeyword);
    }
  }, [externalKeyword, isLoaded]);

  return {
    keyword,
    setKeyword,
    selectedPlace,
    setSelectedPlace,
    handleSmartSearch,
  };
};

export default usePlaceSearch;
