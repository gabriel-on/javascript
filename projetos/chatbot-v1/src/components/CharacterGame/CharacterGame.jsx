import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuthentication';
import { getDatabase, ref, onValue } from 'firebase/database';

const CharacterGame = ({ userId }) => {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [characters, setCharacters] = useState([]);
    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const [characterHealth, setCharacterHealth] = useState(0); // Corrigido para iniciar com 0
    const [enemy, setEnemy] = useState(null);
    const [enemyHealth, setEnemyHealth] = useState(0); // Corrigido para iniciar com 0
    const [combatLog, setCombatLog] = useState([]);
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);

    useEffect(() => {
        if (currentUser) {
            setLoading(false);
            console.log('userId:', userId);
        }
    }, [currentUser, userId]);

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
                    setCharacters(charactersList);

                    console.log('Dados dos personagens:', charactersList);
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
        setSelectedCharacter(character);
        setCharacterHealth(character.attributes.Vigor * 10); // Corrigido para definir a vida baseada no atributo Vigor

        // Define os atributos do inimigo com pontos pré-definidos
        const randomEnemy = {
            name: 'Goblin',
            health: character.attributes.Vigor * 10, // Vida igual à do personagem selecionado
            attack: Math.floor(Math.random() * 10) + 5, // Ataque aleatório entre 5 e 14
            defense: Math.floor(Math.random() * 5) + 1, // Defesa aleatória entre 1 e 5
            agility: Math.floor(Math.random() * 10) + 1, // Agilidade aleatória entre 1 e 10
            dexterity: Math.floor(Math.random() * 10) + 1, // Destreza aleatória entre 1 e 10
            intelligence: Math.floor(Math.random() * 10) + 1, // Inteligência aleatória entre 1 e 10
            power: Math.floor(Math.random() * 10) + 1, // Poder aleatório entre 1 e 10
            speed: Math.floor(Math.random() * 10) + 1, // Velocidade aleatória entre 1 e 10
            vigor: Math.floor(Math.random() * 10) + 1 // Vigor aleatório entre 1 e 10
        };

        setEnemy(randomEnemy);
        setEnemyHealth(randomEnemy.health);
        setIsPlayerTurn(true);
    };


    const attackEnemy = () => {
        if (!selectedCharacter || !enemy || enemyHealth <= 0 || !isPlayerTurn) return;

        const damage = Math.max(0, selectedCharacter.attributes.Força - enemy.defense);
        setEnemyHealth(prevHealth => Math.max(0, prevHealth - damage));
        setCombatLog([...combatLog, `You dealt ${damage} damage to ${enemy.name}`]);
        setIsPlayerTurn(false);
    };

    useEffect(() => {
        if (enemy && !isPlayerTurn) {
            const enemyAttackTimer = setInterval(() => {
                if (enemyHealth > 0 && selectedCharacter) {
                    const damage = Math.max(0, enemy.attack - selectedCharacter.attributes.Defesa);
                    setCharacterHealth(prevHealth => Math.max(0, prevHealth - damage));
                    setCombatLog([...combatLog, `${enemy.name} dealt ${damage} damage to you`]);
                    setIsPlayerTurn(true); // Troca para o turno do jogador após o ataque do inimigo
                }
            }, 2000);

            return () => clearInterval(enemyAttackTimer);
        }
    }, [enemy, enemyHealth, selectedCharacter, isPlayerTurn, combatLog]);

    const restartGame = () => {
        setSelectedCharacter(null);
        setCharacterHealth(0);
        setEnemy(null);
        setEnemyHealth(0);
        setCombatLog([]);
        setIsPlayerTurn(true);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="character-game">
            {selectedCharacter ? (
                <>
                    <div className="status">
                        <h2>{selectedCharacter.characterName}</h2>
                        <p>Health: {characterHealth}</p>
                        <p>Attack: {selectedCharacter.attributes.Força}</p>
                        <p>Defense: {selectedCharacter.attributes.Defesa}</p>
                        <p>Agility: {selectedCharacter.attributes.Agilidade}</p>
                        <p>Dexterity: {selectedCharacter.attributes.Destreza}</p>
                        <p>Intelligence: {selectedCharacter.attributes.Inteligencia}</p>
                        <p>Power: {selectedCharacter.attributes.Poder}</p>
                        <p>Speed: {selectedCharacter.attributes.Velocidade}</p>
                        <p>Vigor: {selectedCharacter.attributes.Vigor}</p>
                    </div>
                    {enemy && (
                        <div className="status">
                            <h2>{enemy.name}</h2>
                            <p>Health: {enemyHealth}</p>
                            <p>Attack: {enemy.attack}</p>
                            <p>Defense: {enemy.defense}</p>
                            <p>Agility: {enemy.agility}</p>
                            <p>Dexterity: {enemy.dexterity}</p>
                            <p>Intelligence: {enemy.intelligence}</p>
                            <p>Power: {enemy.power}</p>
                            <p>Speed: {enemy.speed}</p>
                            <p>Vigor: {enemy.vigor}</p>
                        </div>
                    )}

                    <button onClick={attackEnemy} disabled={!enemy || enemyHealth <= 0 || !isPlayerTurn}>Attack</button>
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
            ) : (
                <div className="character-list">
                    <h2>Choose your character:</h2>
                    <ul>
                        {characters.map((character, index) => (
                            <li key={index} onClick={() => selectCharacter(character)}>
                                {character.characterName}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default CharacterGame;
