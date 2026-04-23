import React, { useRef } from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ onSearch }) => {
  const inputRef = useRef(null);

  const handleSearch = () => {
    const val = inputRef.current.value;
    if (val.trim()) onSearch(val);
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: '8px 16px',
        borderRadius: '9999px',
        border: '2px solid #F05A28',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      }}
    >
      <input
        ref={inputRef}
        type="text"
        placeholder="맛집 검색..."
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        style={{
          border: 'none',
          outline: 'none',
          fontSize: '14px',
          fontWeight: 'bold',
          width: '120px',
          backgroundColor: 'transparent',
        }}
      />
      <Search
        size={18}
        onClick={handleSearch}
        style={{ color: '#F05A28', marginLeft: '8px', cursor: 'pointer' }}
      />
    </div>
  );
};

export default SearchBar;
