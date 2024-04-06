import React, { useEffect } from 'react';

const SkillLogic = ({ character, opponent, isPlayerTurn, combatLog, setCombatLog, opponentHealth, setOpponentHealth, characterHealth, setCharacterHealth, restartGame, setIsPlayerTurn }) => {
    const applyPowerBonus = (abilityPoints, power) => {
        // Define a quantidade máxima de pontos que podem ser adicionados (limite de 10 - abilityPoints)
        const maxAdditionalPoints = 10 - abilityPoints;
        
        // Calcula a quantidade de pontos adicionais com base na metade do valor de "Poder"
        const additionalPoints = Math.min(maxAdditionalPoints, Math.floor(power / 2));
    
        // Retorna a soma dos pontos de habilidade originais e os pontos adicionais
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
        // Calcula o bônus de dano adicional com base no atributo de "Poder" do personagem
        const extraDamageBonus = Math.min(10, Math.floor(power / 2)); // Máximo de 10 pontos de bônus
        
        // Calcula o dano adicional com base na destreza do atacante e do defensor, ignorando habilidades com 10 pontos ou mais
        const extraDamage = Math.max(0, Math.min(attackerDexterity, defenderDexterity) - 10) + extraDamageBonus;

        // Retorna o dano adicional
        return extraDamage;
    };

    const handleAttack = () => {
        if (!character || !opponent || opponentHealth <= 0 || !isPlayerTurn) return;

        // Calcula o dano base
        let damage = Math.max(0, character.attributes.Força - opponent.attributes.Defesa);

        // Aplica evasão
        damage = applyEvasion(damage, character.attributes.Agilidade, opponent.attributes.Agilidade);

        // Aplica dano extra
        damage += applyExtraDamage(character.attributes.Destreza, opponent.attributes.Destreza, character.attributes.Poder);

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
        damage += applyExtraDamage(opponent.attributes.Destreza, character.attributes.Destreza, opponent.attributes.Poder);

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

    // Função para aplicar estratégia inteligente
    const applyIntelligenceStrategy = (intelligence) => {
        // Aqui você pode definir como a inteligência afeta a estratégia de combate
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