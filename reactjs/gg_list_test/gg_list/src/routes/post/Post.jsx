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
    // Obter detalhes do jogo
    api.get(`/posts/${id}`)
      .then(response => setGame(response.data))
      .catch(err => console.log(err));

    // Obter detalhes do desenvolvedor
    api.get(`/developers/${game.developerId}`)
      .then(response => setDeveloper(response.data))
      .catch(err => console.log(err));
  }, [id, game.developerId]);

  const handleEditRating = () => {
    // Enviar a nova avaliação para a API (você pode ajustar conforme necessário)
    api.patch(`/posts/${id}`, { rating: newRating })
      .then(response => {
        setGame({ ...game, rating: newRating });
        setEditing(false);
      })
      .catch(err => console.log(err));
  };

  return (
    <div className='game-page'>
      <div>
        <h2>{game.title}</h2>
        <img src={game.img} alt={game.title} />
        <p>{game.description}</p>

        {/* Exibir informações sobre o desenvolvedor */}
        <p>Desenvolvedor: <Link to={`/developers/${developer.id}`}>{developer.name}</Link></p>

        {editing ? (
          // Formulário de edição de avaliação
          <div>
            <label>Nova Avaliação:</label>
            <input
              type="number"
              value={newRating}
              onChange={(e) => setNewRating(e.target.value)}
            />
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
        </div>
      </div>
    </div>
  );
};

export default GamePage;
