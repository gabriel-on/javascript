import { useState, useEffect } from "react";

function useCardGame(initialPlayerCards, initialAICards) {
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
        if (round > 3) {
            if (playerScore > aiScore) {
                setResult('Player Wins the Game!');
            } else if (playerScore < aiScore) {
                setResult('AI Wins the Game!');
            } else {
                setResult('It\'s a Draw!');
            }
        }
    }, [round, playerScore, aiScore]);

    const selectPlayerCard = (card) => {
        setPlayerSelectedCard(card);
    };

    const playCard = () => {
        if (playerSelectedCard) {
            // IA escolhe uma carta aleatoriamente
            const randomIndex = Math.floor(Math.random() * aiCards.length);
            const selectedAICard = aiCards[randomIndex];
            setAIPlayedCard(selectedAICard);

            // Determine o resultado
            const playerTotal = playerSelectedCard.attack + playerSelectedCard.defense;
            const aiTotal = selectedAICard.attack + selectedAICard.defense;

            if (playerTotal > aiTotal) {
                setPlayerScore(playerScore + 1);
            } else if (playerTotal < aiTotal) {
                setAIScore(aiScore + 1);
            }

            // Remova a carta do jogador do baralho
            setPlayerCards(playerCards.filter((card) => card.id !== playerSelectedCard.id));
            setPlayerPlayedCard(playerSelectedCard);
            setPlayerSelectedCard(null);

            if (round < 3) {
                setRound(round + 1);
            }
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
