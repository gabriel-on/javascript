import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../axios/config';
import '../post/post.css';
import ReviewForm from '../../components/ReviewForm/ReviewForm';

const GamePage = () => {
  const { id } = useParams();
  const [game, setGame] = useState({
    reviews: [],
    // ... outras propriedades do jogo
    rating: 0, // Adicione as propriedades necessárias e defina valores padrão, se aplicável
    // Adicione outras propriedades conforme necessário
  });
  const [editing, setEditing] = useState(false);
  const [newRating, setNewRating] = useState('');
  const [favorited, setFavorited] = useState(false);
  const [buttonColor, setButtonColor] = useState(() => {
    return localStorage.getItem(`buttonColor-${id}`) || 'green';
  });

  const handleSaveReview = async (review) => {
    try {
      const response = await api.post(`/posts/${id}/reviews`, { review });
      setGame((prevState) => ({
        ...prevState,
        reviews: [...prevState.reviews, response.data],
      }));
    } catch (err) {
      console.error(err);
    }
  };

  // Estado local para as análises
  const [localReviews, setLocalReviews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const gameResponse = await api.get(`/posts/${id}`);
        setGame(gameResponse.data);

        const editedGameRating = localStorage.getItem(`editedGameRating-${id}`);
        if (editedGameRating) {
          setGame((prevState) => ({ ...prevState, rating: editedGameRating }));
        }
        // Recupera as análises salvas do armazenamento local
        const savedReviews = JSON.parse(localStorage.getItem(`gameReviews-${id}`)) || [];
        setLocalReviews(savedReviews);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [id]);

  const handleEditRating = async () => {
    try {
      await api.patch(`/posts/${id}`, { rating: newRating });
      localStorage.setItem(`editedGameRating-${id}`, newRating);

      setGame((prevState) => ({ ...prevState, rating: newRating }));
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

      setButtonColor((prevColor) => newButtonColor);

      localStorage.setItem(`favoritedStatus-${id}`, JSON.stringify(!favorited));
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
        <p>Data de lançamento:</p>
        <span>{game.releaseDate}</span>
        <p>Classificação: <span>{game.classification}</span></p>

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

        <p>Plataformas:</p>
        <div className='game-details-dev'>
          <ul>
            {game.devices && Array.isArray(game.devices) ? (
              game.devices.map((device, index) => (
                <li key={index}>{device}</li>
              ))
            ) : (
              <li>{game.devices}</li>
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
            <p>Avaliação: <span>{game.rating}/10</span></p>
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

        <ReviewForm id={id} onSaveReview={handleSaveReview} setGame={setGame} />

        <div>
          {Array.isArray(localReviews) && localReviews.length > 0 ? (
            <div>
              <h3>Análises</h3>
              {localReviews.map((review, index) => (
                <div key={index}>
                  {/* Se o objeto da análise contém uma propriedade 'review', use-a para exibir o comentário */}
                  <p><strong>Comentário:</strong></p>
                  <span>{review}</span>
                  {/* Adicione mais informações da análise, se necessário */}
                </div>
              ))}
            </div>
          ) : (
            <p>Nenhuma análise disponível.</p>
          )}

          {game.link && (
            <Link to={game.link} target='_blank'>
              <h3>Site oficial</h3>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default GamePage;