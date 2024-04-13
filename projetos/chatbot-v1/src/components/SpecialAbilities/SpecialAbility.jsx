import React, { useState } from 'react';

const SpecialAbility = ({ characterName, opponent, opponentHealth, setOpponentHealth, characterHealth, setCharacterHealth, setIsPlayerTurn, combatLog, setCombatLog, restartGame, CharacterGame, onSpecialAbility, disabled }) => {
    const [isSpecialAbilityUsed, setIsSpecialAbilityUsed] = useState(false);

    const handleSpecialAbility = () => {
        if (!characterName || !opponent || opponentHealth <= 0 || characterHealth <= 0 || isSpecialAbilityUsed) return;

        const specialAbilityDamage = 20; // Dano fixo para ambos (20 de dano)

        console.log(`${characterName} used their special ability and dealt ${specialAbilityDamage} damage to themselves and ${opponent.name}`);

        const newCharacterHealth = Math.max(0, characterHealth - specialAbilityDamage);
        setCharacterHealth(newCharacterHealth);

        const newOpponentHealth = Math.max(0, opponentHealth - specialAbilityDamage);
        setOpponentHealth(newOpponentHealth);

        setIsSpecialAbilityUsed(true);

        // Troca para o turno do oponente
        setIsPlayerTurn(false);

        // Aguarda um curto período de tempo e, em seguida, permite que o oponente ataque
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

    // Função para determinar se a habilidade especial será usada nesta rodada
    const shouldUseSpecialAbility = () => {
        return Math.random() < 0.5; // 50% de chance
    };

    // Verifica se a habilidade especial será usada nesta rodada e se não foi usada antes
    if (shouldUseSpecialAbility() && !isSpecialAbilityUsed) {
        // Ativa a habilidade especial
        handleSpecialAbility();
    }

    return (
        <>
            <button onClick={onSpecialAbility} disabled={disabled}>
                Special Ability
            </button>
        </>
    );
};

export default SpecialAbility;
