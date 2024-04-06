import React, { useEffect } from 'react';
import SpecialAbility from '../SpecialAbilities/SpecialAbility';

const SkillLogic = ({ character, opponent, isPlayerTurn, combatLog, setCombatLog, opponentHealth, setOpponentHealth, characterHealth, setCharacterHealth, restartGame, setIsPlayerTurn }) => {
    const applyPowerBonus = (abilityPoints, power) => {
        const maxAdditionalPoints = 10 - abilityPoints;
        const additionalPoints = Math.min(maxAdditionalPoints, Math.floor(power / 2));
        return abilityPoints + additionalPoints;
    };

    const calculateAbilityPoints = (character, power) => {
        const abilityPoints = {
            Força: applyPowerBonus(character.attributes.Força, power),
            Agilidade: applyPowerBonus(character.attributes.Agilidade, power),
            Destreza: applyPowerBonus(character.attributes.Destreza, power),
            Defesa: applyPowerBonus(character.attributes.Defesa, power),
            Inteligencia: applyPowerBonus(character.attributes.Inteligencia, power),
            Conhecimento: applyPowerBonus(character.attributes.Conhecimento, power),
            Estratégia: applyPowerBonus(character.attributes.Estratégia, power),
        };
        return abilityPoints;
    };

    const applyExtraDamage = (attackerDexterity, defenderDexterity, power) => {
        const extraDamageBonus = Math.min(10, Math.floor(power / 2));
        const extraDamage = Math.max(0, Math.min(attackerDexterity, defenderDexterity) - 10) + extraDamageBonus;
        return extraDamage;
    };

    const handleAttack = () => {
        if (!character || !opponent || opponentHealth <= 0 || !isPlayerTurn) return;

        let damage = Math.max(0, character.attributes.Força - opponent.attributes.Defesa);
        damage = applyEvasion(damage, character.attributes.Agilidade, opponent.attributes.Agilidade);
        damage += applyExtraDamage(character.attributes.Destreza, opponent.attributes.Destreza, character.attributes.Poder);
        damage += applyIntelligenceStrategy(character.attributes.Inteligencia);

        const newOpponentHealth = Math.max(0, opponentHealth - damage);
        setOpponentHealth(newOpponentHealth);
        setCombatLog([...combatLog, `You dealt ${damage} damage to ${opponent.characterName}`]);

        if (newOpponentHealth <= 0) {
            restartGame();
            return;
        }

        setIsPlayerTurn(false);

        setTimeout(() => {
            opponentAttack();
        }, 2000);
    };

    const opponentAttack = () => {
        if (!character || !opponent || characterHealth <= 0 || isPlayerTurn) return;

        let damage = Math.max(0, opponent.attributes.Força - character.attributes.Defesa);
        damage = applyEvasion(damage, opponent.attributes.Agilidade, character.attributes.Agilidade);
        damage += applyExtraDamage(opponent.attributes.Destreza, character.attributes.Destreza, opponent.attributes.Poder);
        damage += applyIntelligenceStrategy(opponent.attributes.Inteligencia);

        const newCharacterHealth = Math.max(0, characterHealth - damage);
        setCharacterHealth(newCharacterHealth);
        setCombatLog([...combatLog, `${opponent.characterName} dealt ${damage} damage to you`]);

        setIsPlayerTurn(true);
    };

    const applyEvasion = (damage, attackerAgility, defenderAgility) => {
        const avoidanceChance = defenderAgility * 0.05;
        if (Math.random() < avoidanceChance) {
            console.log("Attack avoided!");
            damage = 0;
        }
        return damage;
    };

    const applyIntelligenceStrategy = (intelligence) => {
        const intelligenceBonus = Math.round(intelligence * 0.1);
        return intelligenceBonus;
    };

    useEffect(() => {
        if (!isPlayerTurn) {
            const timeout = setTimeout(() => {
                opponentAttack();
            }, 2000);
            return () => clearTimeout(timeout);
        }
    }, [isPlayerTurn]);

    return (
        <div>
            <button onClick={handleAttack} disabled={!opponent || opponentHealth <= 0 || !isPlayerTurn || characterHealth <= 0}>
                Attack
            </button>
            <SpecialAbility
                characterName={character.characterName}
                opponent={opponent}
                opponentHealth={opponentHealth}
                setOpponentHealth={setOpponentHealth}
                characterHealth={characterHealth}
                setCharacterHealth={setCharacterHealth}
                setIsPlayerTurn={setIsPlayerTurn}
                combatLog={combatLog}
                setCombatLog={setCombatLog}
                restartGame={restartGame}
            />

        </div>
    );
};

export default SkillLogic;