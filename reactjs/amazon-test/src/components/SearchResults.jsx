// components/SearchResults.js
import React from 'react';

function SearchResults({ results }) {
  // Verifica se results é um array
  if (!Array.isArray(results)) {
    // Se não for, retorna uma mensagem de erro ou um estado vazio, conforme necessário
    return <p>Nenhum resultado encontrado.</p>;
  }

  return (
    <div>
      <h2>Resultados:</h2>
      <ul>
        {results.map((result) => (
          <li key={result.id}>
            <strong>{result.title}</strong> - R${result.price.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchResults;
