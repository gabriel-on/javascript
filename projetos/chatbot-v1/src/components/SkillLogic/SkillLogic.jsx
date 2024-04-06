import React, { useEffect } from 'react';

const SkillLogic = ({ character, opponent, isPlayerTurn, combatLog, setCombatLog, opponentHealth, setOpponentHealth, characterHealth, setCharacterHealth, restartGame, setIsPlayerTurn }) => {
    const handleAttack = () => {
        if (!character || !opponent || opponentHealth <= 0 || !isPlayerTurn) return;

        // Calcula o dano base
        let damage = Math.max(0, character.attributes.Força - opponent.attributes.Defesa);

        // Aplica evasão
        damage = applyEvasion(damage, character.attributes.Agilidade, opponent.attributes.Agilidade);

        // Aplica dano extra
        damage += applyExtraDamage(character.attributes.Destreza, opponent.attributes.Destreza);

        // Aplica estratégia inteligente
        damage += applyIntelligenceStrategy(character.attributes.Inteligencia);

        // Atualiza a saúde do oponente e o registro de combate
        const newOpponentHealth = Math.max(0, opponentHealth - damage);
        setOpponentHealth(newOpponentHealth);
        setCombatLog([...combatLog, `You dealt ${damage} damage to ${opponent.characterName}`]);

        if (newOpponentHealth <= 0) {
            // Chama a função do componente pai para reiniciar o jogo
            restartGame();
            return;
        }

        // Troca para o turno do oponente
        setIsPlayerTurn(false);

        // Aguarda um curto período de tempo e, em seguida, permite que o oponente ataque
        setTimeout(() => {
            opponentAttack();
        }, 2000);
    };

    const opponentAttack = () => {
        if (!character || !opponent || characterHealth <= 0 || isPlayerTurn) return;

        // Calcula o dano base do oponente
        let damage = Math.max(0, opponent.attributes.Força - character.attributes.Defesa);

        // Aplica evasão
        damage = applyEvasion(damage, opponent.attributes.Agilidade, character.attributes.Agilidade);

        // Aplica dano extra
        damage += applyExtraDamage(opponent.attributes.Destreza, character.attributes.Destreza);

        // Aplica estratégia inteligente
        damage += applyIntelligenceStrategy(opponent.attributes.Inteligencia);

        // Atualiza a saúde do jogador e o registro de combate
        const newCharacterHealth = Math.max(0, characterHealth - damage);
        setCharacterHealth(newCharacterHealth);
        setCombatLog([...combatLog, `${opponent.characterName} dealt ${damage} damage to you`]);

        // Troca para o turno do jogador
        setIsPlayerTurn(true);
    };

    // Função para aplicar evasão
    const applyEvasion = (damage, attackerAgility, defenderAgility) => {
        const avoidanceChance = defenderAgility * 0.05; // 5% de chance por ponto de agilidade
        if (Math.random() < avoidanceChance) {
            console.log("Attack avoided!");
            damage = 0; // Define o dano como zero se o ataque for evitado
        }
        return damage;
    };

    // Função para aplicar dano extra
    const applyExtraDamage = (attackerDexterity, defenderDexterity) => {
        const extraDamageChance = attackerDexterity * 0.1; // 10% de chance por ponto de destreza
        if (Math.random() < extraDamageChance) {
            const extraDamage = attackerDexterity; // Dano extra é igual aos pontos de destreza
            console.log("Extra damage dealt!");
            return extraDamage;
        }
        return 0;
    };

    // Função para aplicar estratégia inteligente
    const applyIntelligenceStrategy = (intelligence) => {
        // Aqui você pode definir como a inteligência afeta a estratégia de combate
        // Por exemplo, você pode adicionar um bônus ao dano com base na inteligência do personagem
        const intelligenceBonus = Math.round(intelligence * 0.1); // Bônus de inteligência como número inteiro
        return intelligenceBonus;
    };

    useEffect(() => {
        if (!isPlayerTurn) {
            // Após um curto período de tempo, permite que o oponente ataque
            const timeout = setTimeout(() => {
                opponentAttack();
            }, 2000);

            // Limpa o timeout quando o componente for desmontado ou quando o turno do jogador for restaurado
            return () => clearTimeout(timeout);
        }
    }, [isPlayerTurn]);

    return (
        <button onClick={handleAttack} disabled={!opponent || opponentHealth <= 0 || !isPlayerTurn || characterHealth <= 0}>
            Attack
        </button>
    );
};

export default SkillLogic;
