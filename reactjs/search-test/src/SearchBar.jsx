// src/components/SearchBar.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const history = useNavigate();

    const handleInputChange = (event) => {
        setQuery(event.target.value);
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/items?q=${query}`);
            history({
                pathname: '/search',
                state: { results: response.data }
            });
        } catch (error) {
            console.error('Erro ao buscar resultados:', error);
        }
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Digite o nome desejado"
                value={query}
                onChange={handleInputChange}
            />
            <button onClick={handleSearch}>Pesquisar</button>
        </div>
    );
};

export default SearchBar;
