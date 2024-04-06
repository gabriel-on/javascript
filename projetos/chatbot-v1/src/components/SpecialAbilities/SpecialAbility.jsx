import React, { useState } from 'react';

const SpecialAbility = ({ characterName, opponent, opponentHealth, setOpponentHealth, characterHealth, setCharacterHealth, setIsPlayerTurn, combatLog, setCombatLog, restartGame }) => {
    const [isSpecialAbilityUsed, setIsSpecialAbilityUsed] = useState(false);

    const handleSpecialAbility = () => {
        if (!characterName || !opponent || opponentHealth <= 0 || characterHealth <= 0 || isSpecialAbilityUsed) return;

        // Reduz a saúde do personagem em 25%
        const characterDamage = Math.round(characterHealth * 0.25);
        const newCharacterHealth = Math.max(0, characterHealth - characterDamage);
        setCharacterHealth(newCharacterHealth);

        // Causa um dano fixo de 20 ao oponente
        const opponentDamage = 20;
        const newOpponentHealth = Math.max(0, opponentHealth - opponentDamage);
        setOpponentHealth(newOpponentHealth);

        // Registra a ação no log de combate
        setCombatLog([...combatLog, `${characterName} used their special ability and took ${characterDamage} damage. They dealt ${opponentDamage} damage to ${opponent.name}`]);

        // Verifica se o oponente foi derrotado
        if (newOpponentHealth <= 0) {
            restartGame();
            return;
        }

        setIsSpecialAbilityUsed(true);

        // Troca para o turno do oponente após um breve atraso
        setIsPlayerTurn(false);

        setTimeout(() => {
            opponentAttack();
        }, 2000);
    };

    const opponentAttack = () => {
        if (!characterName || !opponent || characterHealth <= 0) return;

        // Implemente a lógica de ataque do oponente aqui

        // Troca para o turno do jogador
        setIsPlayerTurn(true);
    };

    return (
        <button onClick={handleSpecialAbility} disabled={!opponent || opponentHealth <= 0 || characterHealth <= 0 || isSpecialAbilityUsed}>
            Special Ability
        </button>
    );
};

export default SpecialAbility;
