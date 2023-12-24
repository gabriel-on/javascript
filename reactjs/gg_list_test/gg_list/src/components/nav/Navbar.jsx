// Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchForm from '../searchForm/SearchForm';
import SearchResults from '../SearchResults/SearchResults';
import api from '../../axios/config';

const Navbar = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  const handleSearch = async (results, term) => {
    setSearchResults(results);
    setSearchTerm(term);
  };

  const handleResultClick = (id) => {
    navigate(`/posts/${id}`);
  };

  return (
    <div className='navbar'>
      {/* LOGO */}
      <h2>
        <Link to={"/"}>GameList</Link>
      </h2>

      {/* BARRA DE PESQUISA */}
      <SearchForm onSearch={(results, term) => handleSearch(results, term)} />

      {/* NAVBAR */}
      <ul>
        <li>
          <Link to={"/"}>Home</Link>
        </li>
        <li>
          <Link to={"/developers"}>Devs</Link>
        </li>
        <li>
          <Link to={"/new"}>Adicionar Jogo</Link>
        </li>
        <li>
          <Link to={"/admin"}>Gerenciar</Link>
        </li>
      </ul>

      {/* RESULTADOS DA PESQUISA - Renderizado abaixo da navbar */}
      {/* {searchResults.length > 0 && (
        <SearchResults results={searchResults} onResultClick={handleResultClick} />
      )} */}
    </div>
  );
};

export default Navbar;
