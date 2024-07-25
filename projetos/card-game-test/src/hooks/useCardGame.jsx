import { useState, useEffect } from "react";
import { ref, onValue, set } from "firebase/database";
import { database } from "../firebase/config"; // Certifique-se de que o caminho está correto

function useCardGame(roomId, playerId, initialPlayerCards, initialAICards) {
    const [gameState, setGameState] = useState(null);
    const [playerCards, setPlayerCards] = useState(initialPlayerCards);
    const [aiCards, setAICards] = useState(initialAICards);
    const [playerSelectedCard, setPlayerSelectedCard] = useState(null);
    const [playerPlayedCard, setPlayerPlayedCard] = useState(null);
    const [aiPlayedCard, setAIPlayedCard] = useState(null);
    const [result, setResult] = useState(null);
    const [round, setRound] = useState(1);
    const [playerScore, setPlayerScore] = useState(0);
    const [aiScore, setAIScore] = useState(0);

    useEffect(() => {
        const gameRef = ref(database, `games/${roomId}`);

        const unsubscribe = onValue(gameRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setGameState(data);
                setPlayerCards(data.playerCards);
                setAICards(data.aiCards);
                setPlayerPlayedCard(data.playerPlayedCard);
                setAIPlayedCard(data.aiPlayedCard);
                setPlayerScore(data.playerScore);
                setAIScore(data.aiScore);
                setRound(data.round);
                setResult(data.result);
            }
        });

        return () => {
            unsubscribe();
        };
    }, [roomId]);

    useEffect(() => {
        if (round > 3) {
            let gameResult;
            if (playerScore > aiScore) {
                gameResult = 'Player Wins the Game!';
            } else if (playerScore < aiScore) {
                gameResult = 'AI Wins the Game!';
            } else {
                gameResult = 'It\'s a Draw!';
            }
            setResult(gameResult);
            updateGameState({ result: gameResult });
        }
    }, [round, playerScore, aiScore]);

    const updateGameState = (updates) => {
        const gameRef = ref(database, `games/${roomId}`);
        set(gameRef, {
            ...gameState,
            ...updates,
        });
    };

    const selectPlayerCard = (card) => {
        setPlayerSelectedCard(card);
    };

    const playCard = () => {
        if (playerSelectedCard) {
            const selectedAICard = aiCards.reduce((bestCard, currentCard) => {
                const currentTotal = currentCard.attack + currentCard.defense;
                const bestTotal = bestCard.attack + bestCard.defense;
                return currentTotal > bestTotal ? currentCard : bestCard;
            }, aiCards[0]);
            setAIPlayedCard(selectedAICard);

            const playerTotal = playerSelectedCard.attack + playerSelectedCard.defense;
            const aiTotal = selectedAICard.attack + selectedAICard.defense;

            let newPlayerScore = playerScore;
            let newAIScore = aiScore;
            if (playerTotal > aiTotal) {
                newPlayerScore++;
            } else if (playerTotal < aiTotal) {
                newAIScore++;
            }

            const newPlayerCards = playerCards.filter((card) => card.id !== playerSelectedCard.id);
            const newAICards = aiCards.filter((card) => card.id !== selectedAICard.id);

            setPlayerCards(newPlayerCards);
            setAICards(newAICards);
            setPlayerPlayedCard(playerSelectedCard);
            setPlayerSelectedCard(null);
            setPlayerScore(newPlayerScore);
            setAIScore(newAIScore);

            updateGameState({
                playerCards: newPlayerCards,
                aiCards: newAICards,
                playerPlayedCard: playerSelectedCard,
                aiPlayedCard: selectedAICard,
                playerScore: newPlayerScore,
                aiScore: newAIScore,
                round: round + 1,
            });

            setTimeout(() => {
                if (round < 3) {
                    setRound(round + 1);
                    setPlayerPlayedCard(null);
                    setAIPlayedCard(null);
                    setResult(null);

                    updateGameState({
                        playerPlayedCard: null,
                        aiPlayedCard: null,
                        result: null,
                    });
                }
            }, 2000);
        }
    };

    return {
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
    };
}

export default useCardGame;
