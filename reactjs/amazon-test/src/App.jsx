// components/App.js
import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';

const App = () => {
  const [results, setResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:7001/products/?q=${searchTerm}`
        );
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Erro ao buscar resultados:', error);
      }
    };

    fetchData();
  }, [searchTerm]);

  const handleSearch = (query) => {
    setSearchTerm(query);
  };

  return (
    <div>
      <h1>Barra de Pesquisa Amazon</h1>
      <SearchBar onSearch={handleSearch} />
      <SearchResults results={results} />
    </div>
  );
};

export default App;
