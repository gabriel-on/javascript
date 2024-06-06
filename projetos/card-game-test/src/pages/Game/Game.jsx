import React, { useEffect, useState } from "react";
import { ref, onValue, off } from "firebase/database";
import { database } from "../../firebase/config";
import { useAuth } from "../../hooks/useAuthentication";
import useCardGame from "../../hooks/useCardGame";
import './Game.css';
import PlayedCard from "../../components/PlayedCard/PlayedCard";

const playerInitialCards = [
    { id: 1, image: '/cards/card1.png', attack: 5, defense: 3 },
    { id: 2, image: '/cards/card2.png', attack: 7, defense: 2 },
    { id: 3, image: '/cards/card3.png', attack: 6, defense: 4 },
    // Adicione mais cartas conforme necessário
];

const aiInitialCards = [
    { id: 1, image: '/cards/card1.png', attack: 4, defense: 5 },
    { id: 2, image: '/cards/card2.png', attack: 8, defense: 1 },
    { id: 3, image: '/cards/card3.png', attack: 3, defense: 6 },
    // Adicione mais cartas conforme necessário
];

function Game() {
    const [gameState, setGameState] = useState(null);
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

    const {
        playerCards,
        aiCards,
        playerSelectedCard,
        playerPlayedCard,
        aiPlayedCard,
        result,
        selectPlayerCard,
        playCard,
        round,
        playerScore,
        aiScore
    } = useCardGame(playerInitialCards, aiInitialCards);

    return (
        <div>
            <h2>Game State:</h2>
            <pre>{JSON.stringify(gameState, null, 2)}</pre>
            <div className="cards-container">
                {playerCards.map((card) => (
                    <div key={card.id} className="card-container">
                        <div className="card">
                            <img
                                src={card.image}
                                alt={`Card ${card.id}`}
                                onClick={() => selectPlayerCard(card)}
                                className={`card-image ${playerSelectedCard && playerSelectedCard.id === card.id ? 'selected' : ''}`}
                            />
                            {!playerSelectedCard && (
                                <div className="card-overlay"></div>
                            )}
                            <div className="card-stats">
                                <p>Attack: {card.attack}</p>
                                <p>Defense: {card.defense}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <h3>Round: {round}</h3>
            <h3>Player Score: {playerScore}</h3>
            <h3>AI Score: {aiScore}</h3>
            <div>
                <h3>Carta jogada pelo jogador:</h3>
                <PlayedCard card={playerPlayedCard} />
            </div>
            <div>
                <h3>Carta jogada pela IA:</h3>
                <PlayedCard card={aiPlayedCard} />
            </div>
            {playerSelectedCard && (
                <div>
                    <button onClick={playCard}>Play Card</button>
                </div>
            )}
            <div className="ai-cards-container">
                <h3>AI's Cards:</h3>
                <div className="cards-container">
                    {aiCards.map((card) => (
                        <div key={card.id} className="card-container">
                            <div className="card">
                                <img
                                    src="/cards/card-back.png"
                                    alt="AI Card"
                                    className="card-image"
                                />
                                {!aiPlayedCard && (
                                    <div className="card-overlay"></div>
                                )}
                                <div className="card-stats">
                                    <p>Attack: ??</p>
                                    <p>Defense: ??</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {result && (
                <div>
                    <h3>{result}</h3>
                </div>
            )}
        </div>
    );
}

export default Game;
