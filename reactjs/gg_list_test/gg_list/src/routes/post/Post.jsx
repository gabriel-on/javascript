import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../axios/config';
import { Link } from 'react-router-dom';
import '../post/Post.css';

const GamePage = () => {
  const { id } = useParams();
  const [game, setGame] = useState({});
  const [developer, setDeveloper] = useState({});
  const [editing, setEditing] = useState(false);
  const [newRating, setNewRating] = useState('');

  useEffect(() => {
    // Função assíncrona para buscar detalhes do jogo e do desenvolvedor
    const fetchData = async () => {
      try {
        const gameResponse = await api.get(`/posts/${id}`);
        setGame(gameResponse.data);

        const developerResponse = await api.get(`/developers/${gameResponse.data.developerId}`);
        setDeveloper(developerResponse.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData(); // Chamar a função assíncrona
  }, [id]); // Remover game.developerId da lista de dependências

  const handleEditRating = () => {
    // Enviar a nova avaliação para a API (você pode ajustar conforme necessário)
    api.patch(`/posts/${id}`, { rating: newRating })
      .then(response => {
        setGame({ ...game, rating: newRating });
        setEditing(false);
      })
      .catch(err => console.log(err));
  };

  const ratingOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div className='game-page'>
      <div>
        <h2>{game.title}</h2>
        <img src={game.img} alt={game.title} />
        <p>{game.description}</p>

        {/* Exibir informações sobre o desenvolvedor */}
        <p>Desenvolvedor: <Link to={`/developers/${developer.id}`}>{developer.name}</Link></p>

        {editing ? (
          // Formulário de edição de avaliação com um select
          <div>
            <label>Nova Avaliação:</label>
            <select
              value={newRating}
              onChange={(e) => setNewRating(e.target.value)}
            >
              {ratingOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <button onClick={handleEditRating}>Salvar Avaliação</button>
          </div>
        ) : (
          // Exibir avaliação atual e botão de edição
          <div>
            <p>Avaliação: {game.rating}/10</p>
            <button onClick={() => setEditing(true)}>Editar Avaliação</button>
          </div>
        )}

        <div className="game-details">
          <p>Gêneros:</p>
          {game.genres && Array.isArray(game.genres) && (
            <ul>
              {game.genres.map((genre, index) => (
                <li key={index}>{genre}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default GamePage;
