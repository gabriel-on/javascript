// SearchResults.js
import React from 'react';

const SearchResults = ({ results }) => {
    return (
        <div>
            <h2>Resultados da Pesquisa</h2>
            {results.map((result) => (
                <div key={result.id}>{/* Renderizar detalhes do resultado */}</div>
            ))}
        </div>
    );
};

export default SearchResults;
