import React, { useState, useEffect } from 'react';

const GameList = ({ games, developers }) => {
  const [filteredGames, setFilteredGames] = useState([]);
  const [selectedDeveloper, setSelectedDeveloper] = useState(null);

  // Certifique-se de que games e developers são arrays antes de mapear
  useEffect(() => {
    if (Array.isArray(games) && Array.isArray(developers)) {
      if (selectedDeveloper) {
        const filtered = games.filter(game =>
          game.developers.includes(selectedDeveloper.name)
        );
        setFilteredGames(filtered);
      } else {
        // Se nenhum desenvolvedor estiver selecionado, exibe todos os jogos
        setFilteredGames(games);
      }
    }
  }, [selectedDeveloper, games]);

  return (
    <div>
      <h2>Lista de Jogos</h2>

      {/* Dropdown para selecionar o desenvolvedor */}
      <select
        onChange={(e) => {
          const developerId = parseInt(e.target.value);
          const selected = developers.find(dev => dev.id === developerId);
          setSelectedDeveloper(selected);
        }}
      >
        <option value={null}>Todos os Desenvolvedores</option>
        {Array.isArray(developers) && developers.map(developer => (
          <option key={developer.id} value={developer.id}>
            {developer}
          </option>
        ))}
      </select>

      {/* Exibe a lista de jogos filtrada */}
      <ul>
        {Array.isArray(filteredGames) && filteredGames.map(game => (
          <li key={game.id}>{game.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default GameList;