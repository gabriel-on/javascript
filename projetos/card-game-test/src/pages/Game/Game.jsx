import React, { useEffect, useState } from "react";
import { ref, onValue, off, set } from "firebase/database";
import { database } from "../../firebase/config";
import { useAuth } from "../../hooks/useAuthentication";
import './Game.css';

const initialCards = [
  { id: 1, image: '/cards/card1.png', attack: 5, defense: 3 },
  { id: 2, image: '/cards/card2.png', attack: 7, defense: 2 },
  { id: 3, image: '/cards/card3.png', attack: 6, defense: 4 },
  // Adicione mais cartas conforme necessário
];

const aiCards = [
  { id: 4, image: '/cards/card4.png', attack: 4, defense: 5 },
  { id: 5, image: '/cards/card5.png', attack: 8, defense: 1 },
  { id: 6, image: '/cards/card6.png', attack: 3, defense: 6 },
  // Adicione mais cartas conforme necessário
];

function Game() {
  const [gameState, setGameState] = useState(null);
  const [cards, setCards] = useState(initialCards);
  const [aiDeck, setAiDeck] = useState(aiCards);
  const [playerCard, setPlayerCard] = useState(null);
  const [aiCard, setAiCard] = useState(null);
  const [result, setResult] = useState(null);
  const { auth } = useAuth();

  useEffect(() => {
    const gameRef = ref(database, "game");

    const unsubscribe = onValue(gameRef, (snapshot) => {
      const data = snapshot.val();
      setGameState(data);
    });

    return () => {
      off(gameRef);
    };
  }, [auth]);

  const handleSelectCard = (card) => {
    setPlayerCard(card);
  };

  const handlePlayCard = () => {
    if (playerCard) {
      // IA escolhe uma carta aleatoriamente
      const randomIndex = Math.floor(Math.random() * aiDeck.length);
      const selectedAiCard = aiDeck[randomIndex];
      setAiCard(selectedAiCard);

      // Remova a carta selecionada do baralho da IA
      setAiDeck(aiDeck.filter((card) => card.id !== selectedAiCard.id));

      // Determine o resultado
      const playerTotal = playerCard.attack + playerCard.defense;
      const aiTotal = selectedAiCard.attack + selectedAiCard.defense;

      let gameResult;
      if (playerTotal > aiTotal) {
        gameResult = 'Player Wins!';
      } else if (playerTotal < aiTotal) {
        gameResult = 'AI Wins!';
      } else {
        gameResult = 'It\'s a Draw!';
      }
      setResult(gameResult);

      // Atualize o estado do jogo no Firebase
      const gameRef = ref(database, "game");
      set(gameRef, {
        ...gameState,
        lastPlayedCard: playerCard,
        aiCard: selectedAiCard,
        result: gameResult
      });

      // Remova a carta do jogador do baralho
      setCards(cards.filter((card) => card.id !== playerCard.id));
      setPlayerCard(null);
    }
  };

  return (
    <div>
      <h2>Game State:</h2>
      <pre>{JSON.stringify(gameState, null, 2)}</pre>
      <div className="cards-container">
        {cards.map((card) => (
          <div key={card.id} className="card-container">
            <img
              src={card.image}
              alt={`Card ${card.id}`}
              onClick={() => handleSelectCard(card)}
              className={`card ${playerCard && playerCard.id === card.id ? 'selected' : ''}`}
            />
            <div className="card-stats">
              <p>Attack: {card.attack}</p>
              <p>Defense: {card.defense}</p>
            </div>
          </div>
        ))}
      </div>
      {playerCard && (
        <div>
          <button onClick={handlePlayCard}>Play Card</button>
        </div>
      )}
      <div className="result">
        {aiCard && (
          <div>
            <h3>AI played:</h3>
            <div className="card-container">
              <img src={aiCard.image} alt={`Card ${aiCard.id}`} className="card" />
              <div className="card-stats">
                <p>Attack: {aiCard.attack}</p>
                <p>Defense: {aiCard.defense}</p>
              </div>
            </div>
          </div>
        )}
        {result && <h3>{result}</h3>}
      </div>
      <button onClick={() => auth.signOut()}>Logout</button>
    </div>
  );
}

export default Game;
