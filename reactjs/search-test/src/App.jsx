// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';

const App = () => {
  return (
    <Router>
      <div>
        <h1>Meu Site de Pesquisa</h1>
        <SearchBar />
        <Routes>
          <Route path="/search" component={SearchResults} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
