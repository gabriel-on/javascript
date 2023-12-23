// SearchBar.js
import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearch = () => {
        onSearch(searchQuery);
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Pesquisar..."
                value={searchQuery}
                onChange={handleInputChange}
            />
            <button onClick={handleSearch}>Pesquisar</button>
        </div>
    );
};

export default SearchBar;
