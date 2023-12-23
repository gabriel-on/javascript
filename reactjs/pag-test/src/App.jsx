// Sua página ou componente principal
import React, { useState } from 'react';
import PaginatedList from '../src/PagList';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';

const App = () => {
  // const [searchResults, setSearchResults] = useState([]);

  // Seus dados que precisam ser paginados
  const data =
    [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' },
      { id: 4, name: 'Item 4' },
      { id: 5, name: 'Item 5' },
      { id: 6, name: 'Item 6' },
      { id: 7, name: 'Item 7' },
      { id: 8, name: 'Item 8' },
      { id: 9, name: 'Item 9' },
      { id: 10, name: 'Item 10' },
      { id: 11, name: 'Item 11' },
      { id: 12, name: 'Item 12' },
      { id: 13, name: 'Item 13' },
      { id: 14, name: 'Item 14' },
      { id: 15, name: 'Item 15' },
    ]; // Substitua pelo seu conjunto de dados

  // const handleSearch = (query) => {

    // Filtre os resultados com base na consulta do usuário
    // const filteredResults = data.filter((item) =>
    //   item.name.toLowerCase().includes(query.toLowerCase())
    // );

    // setSearchResults(filteredResults);
  
  return (
    <div>
      <h1>Lista Paginada</h1>
      <PaginatedList data={data} itemsPerPage={6} />
      {/* <SearchBar onSearch={handleSearch} /> */}
      {/* <SearchResults results={searchResults} /> */}
    </div>
  );
};

export default App;