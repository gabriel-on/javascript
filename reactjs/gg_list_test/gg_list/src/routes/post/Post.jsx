import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../axios/config';
import { Link } from 'react-router-dom';
import '../post/Post.css';

const GamePage = () => {
  const { id } = useParams();
  const [game, setGame] = useState({});
  const [developer, setDeveloper] = useState({});

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

  return (
    <div className='game-page'>
      <div>
        <h2>{game.title}</h2>
        <img src={game.img} alt={game.title} />
        <p>{game.description}</p>
        
        {/* Exibir informações sobre o desenvolvedor */}
        <p>Desenvolvedor: <Link to={`/developers/${developer.id}`}>{developer.name}</Link></p>

        <div className="game-details">
          <p>Avaliação: {game.rating}/10</p>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
