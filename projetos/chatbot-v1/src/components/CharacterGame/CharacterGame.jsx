import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuthentication';
import { getDatabase, ref, onValue } from 'firebase/database';

const CharacterGame = ({ userId }) => {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [userCharacters, setUserCharacters] = useState([]);
    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const [characterHealth, setCharacterHealth] = useState(0);
    const [opponent, setOpponent] = useState(null);
    const [opponentHealth, setOpponentHealth] = useState(0);
    const [combatLog, setCombatLog] = useState([]);
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const [isChoosingOpponent, setIsChoosingOpponent] = useState(false);

    useEffect(() => {
        if (currentUser) {
            setLoading(false);
        }
    }, [currentUser]);

    useEffect(() => {
        if (userId) {
            const database = getDatabase();
            const userCharactersRef = ref(database, `characters/${userId}`);

            const unsubscribe = onValue(userCharactersRef, (snapshot) => {
                const userData = snapshot.val();
                if (userData) {
                    const charactersList = Object.entries(userData).map(([characterId, characterData]) => ({
                        characterId,
                        ...characterData
                    }));
                    setUserCharacters(charactersList);
                } else {
                    console.log("Nenhum personagem encontrado para este usuário.");
                }
            });

            return () => {
                unsubscribe();
            };
        }
    }, [userId]);

    const selectCharacter = (character) => {
        if (!character) return;

        setSelectedCharacter(character);
        setCharacterHealth(character.attributes.Vigor * 10);
        setIsChoosingOpponent(true); // Permite ao usuário escolher um oponente após selecionar seu personagem
    };

    const selectOpponent = (opponent) => {
        if (!opponent) return;

        setOpponent(opponent);
        setOpponentHealth(opponent.attributes.Vigor * 10);
        setIsChoosingOpponent(false); // Bloqueia a escolha do oponente após selecioná-lo
        startGame(); // Inicia o jogo após selecionar o oponente
    };

    const startGame = () => {
        setIsPlayerTurn(true); // Inicia a partida
    };

    const attackOpponent = () => {
        if (!selectedCharacter || !opponent || opponentHealth <= 0 || !isPlayerTurn) return;

        const damage = Math.max(0, selectedCharacter.attributes.Força - opponent.attributes.Defesa);
        const newOpponentHealth = Math.max(0, opponentHealth - damage);
        setOpponentHealth(newOpponentHealth);
        setCombatLog([...combatLog, `You dealt ${damage} damage to ${opponent.characterName}`]);

        if (newOpponentHealth > 0) {
            setIsPlayerTurn(false); // Troca para o turno do oponente
        } else {
            // O oponente foi derrotado, reinicia o jogo
            restartGame();
        }
    };

    useEffect(() => {
        if (opponent && !isPlayerTurn) {
            // Simula o ataque do oponente depois de um curto período de tempo
            const opponentAttackTimer = setInterval(() => {
                if (opponentHealth > 0 && selectedCharacter) {
                    const damage = Math.max(0, opponent.attributes.Força - selectedCharacter.attributes.Defesa);
                    setCharacterHealth(prevHealth => Math.max(0, prevHealth - damage));
                    setCombatLog([...combatLog, `${opponent.characterName} dealt ${damage} damage to you`]);
                    setIsPlayerTurn(true); // Troca para o turno do jogador após o ataque do oponente
                }
            }, 2000);

            return () => clearInterval(opponentAttackTimer);
        }
    }, [opponent, opponentHealth, selectedCharacter, isPlayerTurn, combatLog]);

    const restartGame = () => {
        setSelectedCharacter(null);
        setCharacterHealth(0);
        setOpponent(null);
        setOpponentHealth(0);
        setCombatLog([]);
        setIsPlayerTurn(true); // Reinicia o turno para o jogador
        setIsChoosingOpponent(false); // Permite ao usuário escolher um novo oponente
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="character-game">
            {!selectedCharacter && !isChoosingOpponent ? (
                <div className="character-list">
                    <h2>Choose your character:</h2>
                    <ul>
                        {userCharacters.map((character, index) => (
                            <li key={index} onClick={() => selectCharacter(character)}>
                                {character.characterName}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <>
                    <div className="status">
                        <h2>{selectedCharacter.characterName}</h2>
                        <p>Health: {characterHealth}</p>
                        {Object.entries(selectedCharacter.attributes).map(([key, value]) => (
                            <div key={key}>
                                <p>{key}: {value}</p>
                            </div>
                        ))}
                    </div>
                    {isChoosingOpponent ? (
                        <div className="character-list">
                            <h2>Choose your opponent:</h2>
                            <ul>
                                {userCharacters
                                    .filter(character => character.characterId !== selectedCharacter.characterId) // Remove o próprio usuário da lista de oponentes
                                    .map((opponent, index) => (
                                        <li key={index} onClick={() => selectOpponent(opponent)}>
                                            {opponent.characterName}
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    ) : (
                        <div className="status">
                            <h2>{opponent.characterName}</h2>
                            <p>Health: {opponentHealth}</p>
                            {Object.entries(opponent.attributes).map(([key, value]) => (
                                <div key={key}>
                                    <p>{key}: {value}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    <button onClick={attackOpponent} disabled={!opponent || opponentHealth <= 0 || !isPlayerTurn}>Attack</button>
                    <button onClick={restartGame}>Restart</button>
                    <div className="combat-log">
                        <h3>Combat Log</h3>
                        <ul>
                            {combatLog.map((log, index) => (
                                <li key={index}>{log}</li>
                            ))}
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
};

export default CharacterGame;
