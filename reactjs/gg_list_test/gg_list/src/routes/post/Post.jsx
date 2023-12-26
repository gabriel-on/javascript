import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../axios/config';
import { Link } from 'react-router-dom';
import './Post.css'; // Importe o arquivo CSS

const GamePage = () => {
  const { id } = useParams();
  const [game, setGame] = useState({});
  const [developer, setDeveloper] = useState({});
  const [editing, setEditing] = useState(false);
  const [newRating, setNewRating] = useState('');
  const [favorited, setFavorited] = useState(false);
  const [buttonColor, setButtonColor] = useState(() => {
    return localStorage.getItem(`buttonColor-${id}`) || 'green';
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const gameResponse = await api.get(`/posts/${id}`);
        setGame(gameResponse.data);

        const developerResponse = await api.get(`/developers/${gameResponse.data.developerId}`);
        setDeveloper(developerResponse.data);

        const editedGameRating = localStorage.getItem('editedGameRating');
        if (editedGameRating) {
          setGame(prevGame => ({ ...prevGame, rating: editedGameRating }));
        }

        const favoritedStatus = localStorage.getItem('favoritedStatus');
        if (favoritedStatus) {
          setFavorited(JSON.parse(favoritedStatus));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [id]);

  const handleEditRating = async () => {
    try {
      await api.patch(`/posts/${id}`, { rating: newRating });
      localStorage.setItem('editedGameRating', newRating);

      setGame(prevGame => ({ ...prevGame, rating: newRating }));
      setEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFavorite = async () => {
    try {
      await api.patch(`/posts/${id}`, { favorited: !favorited });

      const newButtonColor = !favorited ? 'green' : 'red';
      localStorage.setItem(`buttonColor-${id}`, newButtonColor);

      // Utilize uma função de callback para garantir a sincronização do estado
      setButtonColor((prevColor) => newButtonColor);

      localStorage.setItem('favoritedStatus', JSON.stringify(!favorited));
      setFavorited(!favorited);
    } catch (err) {
      console.error(err);
    }
  };

  const ratingOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div className='game-page'>
      <div className="game-details-container">
        <h2>{game.title}</h2>
        <img src={game.img} alt={game.title} className="game-image" />
        <p>{game.description}</p>

        <p>Desenvolvedores:</p>
        <div className='game-details-dev'>
          <ul>
            {game.developers && Array.isArray(game.developers) ? (
              game.developers.map((developer, index) => (
                <li key={index}>{developer}</li>
              ))
            ) : (
              <li>{game.developers}</li>
            )}
          </ul>
        </div>

        {editing ? (
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
          <div className="button-container">
            <p>Avaliação: {game.rating}/10</p>
            <button
              onClick={() => setEditing(true)}
              className="edit-button"
            >
              Editar Avaliação
            </button>

            <button
              onClick={handleFavorite}
              className="favorite-button"
              style={{ backgroundColor: buttonColor, color: 'white' }}
            >
              {favorited ? <i className="bi bi-bookmark-heart"></i> : <i className="bi bi-bookmark-heart-fill"></i>}
            </button>
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
