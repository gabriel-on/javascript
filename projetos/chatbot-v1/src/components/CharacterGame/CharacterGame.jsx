import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';

const CharacterGame = () => {
  const [characters, setCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [enemy, setEnemy] = useState(null);
  const [characterHealth, setCharacterHealth] = useState(0);
  const [enemyHealth, setEnemyHealth] = useState(null);
  const [combatLog, setCombatLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);

  useEffect(() => {
    const database = getDatabase();
    const charactersRef = ref(database, 'result');

    const unsubscribe = onValue(charactersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const charactersArray = Object.values(data);
        setCharacters(charactersArray);
        setLoading(false);
      } else {
        console.error("Nenhum personagem encontrado.");
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

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
  }, [enemy, enemyHealth, selectedCharacter, isPlayerTurn]);

  const selectCharacter = (character) => {
    setSelectedCharacter(character);
    setCharacterHealth(character.attributes.Vigor * 10);
    const randomEnemy = {
      name: 'Goblin',
      health: 20,
      attack: 7,
      defense: 2
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

  const restartGame = () => {
    setSelectedCharacter(null);
    setCharacterHealth(0);
    setEnemy(null);
    setEnemyHealth(null);
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
