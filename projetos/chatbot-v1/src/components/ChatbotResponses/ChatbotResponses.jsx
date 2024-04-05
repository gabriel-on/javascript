import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { ref, onValue, set, push, serverTimestamp } from 'firebase/database';
import { database } from "../../firebase/config";
import '../Chatbot/Chatbot.css';
import { useAuth } from '../../hooks/useAuthentication';

// CSS
import '../ChatbotResponses/ChatbotResponses.css';

const ChatbotResponses = ({ onSaveResult }) => {
    const { currentUser } = useAuth();
    const navigate = useNavigate(); 
    const [step, setStep] = useState(1);
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState("");
    const [characterName, setCharacterName] = useState("");
    const [age, setAge] = useState("");
    const [selectedRace, setSelectedRace] = useState("");
    const [attributes, setAttributes] = useState({
        Força: 0,
        Defesa: 0,
        Poder: 0,
        Vigor: 0,
        Agilidade: 0,
        Velocidade: 0,
        Inteligencia: 0,
        Destreza: 0
    });
    const [races, setRaces] = useState([]);
    const [origin, setOrigin] = useState("");
    const [successMessage, setSuccessMessage] = useState(false);
    const [powersDescription, setPowersDescription] = useState("");
    const [customId, setCustomId] = useState(null);

    // Função para gerar IDs personalizados com números
    const generateCustomId = () => {
        const length = 9; // Define o comprimento do ID personalizado
        let customId = '';

        for (let i = 0; i < length; i++) {
            customId += Math.floor(Math.random() * 10); // Adiciona um dígito aleatório de 0 a 9 ao ID
        }
        return customId;
    };

    useEffect(() => {
        const classesRef = ref(database, 'classes');
        const racesRef = ref(database, 'races');

        onValue(classesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const classList = Object.values(data);
                setClasses(classList);
            }
        });

        onValue(racesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const raceList = Object.values(data);
                setRaces(raceList);
            }
        });
    }, []);

    const handleSelectClass = (className) => {
        setSelectedClass(className);
    };

    const handleSelectRace = (raceName) => {
        setSelectedRace(raceName);
    };

    const handleNextStep = () => {
        setStep(step + 1);
    };

    const handlePreviousStep = () => {
        setStep(step - 1);
    };

    const handleSendButton = () => {
        if (step === 8) { // Verifica se é a última etapa
            const createdBy = currentUser.displayName;
            const createdAt = serverTimestamp();
            const id = generateCustomId(); // Gera um ID personalizado
            setCustomId(id); // Armazena o ID personalizado
            // Crie um objeto contendo os dados que você deseja salvar
            const dataToSave = {
                selectedClass,
                attributes,
                characterName,
                selectedRace,
                age,
                origin,
                createdBy,
                createdAt,
                powersDescription
            };

            // Enviar dados para o Firebase com a chave personalizada
            set(ref(database, 'result/' + id), dataToSave)
                .then(() => {
                    console.log("Dados enviados com sucesso!");
                    setSuccessMessage(true);
                })
                .catch((error) => {
                    console.error("Erro ao enviar dados:", error);
                });
        } else {
            handleNextStep();
        }
    };

    const handleAttributeChange = (attribute, value) => {
        // Verifica se o novo valor excede o limite máximo de 10 pontos por atributo
        if (value <= 10) {
            // Calcula a soma atual dos valores dos atributos
            const currentTotal = Object.values(attributes).reduce((total, val) => total + val, 0);
    
            // Verifica se a soma atual mais o valor atual do atributo não excede o limite total de 36 pontos
            if (currentTotal + (value - (attributes[attribute] || 0)) <= 36) {
                // Garante que o valor não seja menor que 0
                const updatedValue = Math.max(0, value);
                setAttributes(prevAttributes => ({
                    ...prevAttributes,
                    [attribute]: updatedValue
                }));
            } else {
                // Exibe uma mensagem indicando que o limite total de pontos (36) foi excedido
                alert("O limite total de pontos (36) foi excedido!");
            }
        } else {
            // Exibe uma mensagem indicando que o limite máximo de 10 pontos por atributo foi excedido
            alert("Cada habilidade do atributo só pode ter no máximo 10 pontos!");
        }
    };

    const handlePowersDescriptionChange = (event) => {
        setPowersDescription(event.target.value);
    };

    const handleNameChange = (event) => {
        setCharacterName(event.target.value);
    };

    const handleAgeChange = (event) => {
        const value = event.target.value.replace(/\D/, ''); // Somente números
        setAge(value);
    };

    const handleOriginChange = (event) => {
        setOrigin(event.target.value);
    };

    const renderClasses = () => {
        return classes.map((className, index) => (
            <button key={index} onClick={() => handleSelectClass(className)}>{className}</button>
        ));
    };

    const renderRaces = () => {
        return races.map((raceName, index) => (
            <button key={index} onClick={() => handleSelectRace(raceName)}>{raceName}</button>
        ));
    };

    const renderAttributes = () => {
        return Object.entries(attributes).map(([attribute, value]) => (
            <div key={attribute}>
                <span>{attribute}: </span>
                <button onClick={() => handleAttributeChange(attribute, value - 1)}>-</button>
                <span>{value}</span>
                <button onClick={() => handleAttributeChange(attribute, value + 1)}>+</button>
            </div>
        ));
    };

    const renderStepContent = () => {
        if (successMessage) {
            return (
                <div>
                    <p>Personagem criado com sucesso!</p>
                    <button onClick={() => navigate(`/character-details/${customId}`)}>Ver Detalhes do Personagem</button>
                </div>
            );
        }

        switch (step) {
            case 1:
                return (
                    <div className="step-step">
                        <h2>Etapa 1: Insira o nome do personagem</h2>
                        <input type="text" value={characterName} onChange={handleNameChange} />
                        <div>
                            <button className="btn-step" onClick={handleNextStep}>Próxima Etapa</button>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="step-step">
                        <h2>Etapa 2: Insira a idade do personagem</h2>
                        <input type="text" value={age} onChange={handleAgeChange} />
                        <div>
                            <button className="btn-step" onClick={handlePreviousStep}>Voltar</button>
                            <button className="btn-step" onClick={handleNextStep}>Próxima Etapa</button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="step-step">
                        <h2>Etapa 3: Escolha a raça do personagem</h2>
                        {renderRaces()}
                        <div>
                            <button className="btn-step" onClick={handlePreviousStep}>Voltar</button>
                            <button className="btn-step" onClick={handleNextStep}>Próxima Etapa</button>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="step-step">
                        <h2>Etapa 4: Distribua os pontos de atributo</h2>
                        {renderAttributes()}
                        <div>
                            <button className="btn-step" onClick={handlePreviousStep}>Voltar</button>
                            <button className="btn-step" onClick={handleNextStep}>Próxima Etapa</button>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="step-step">
                        <h2>Etapa 5: Descreva os poderes do seu personagem</h2>
                        <textarea value={powersDescription} onChange={handlePowersDescriptionChange} />
                        <div>
                            <button className="btn-step" onClick={handlePreviousStep}>Voltar</button>
                            <button className="btn-step" onClick={handleNextStep}>Próxima Etapa</button>
                        </div>
                    </div>
                );
            case 6:
                return (
                    <div className="step-step">
                        <h2>Etapa 6: Escolha sua classe</h2>
                        {renderClasses()}
                        <div>
                            <button className="btn-step" onClick={handlePreviousStep}>Voltar</button>
                            <button className="btn-step" onClick={handleNextStep}>Próxima Etapa</button>
                        </div>
                    </div>
                );
            case 7:
                return (
                    <div className="step-step">
                        <h2>Etapa 7: Escreva a origem do seu personagem</h2>
                        <textarea value={origin} onChange={handleOriginChange} />
                        <div>
                            <button className="btn-step" onClick={handlePreviousStep}>Voltar</button>
                            <button className="btn-step" onClick={handleNextStep}>Próxima Etapa</button>
                        </div>
                    </div>
                );
            case 8:
                return (
                    <div className="step-step final-step">
                        <h2>Etapa Final: Confirme os dados e conclua</h2>
                        <p>Nome: {characterName}</p>
                        <p>Idade: {age}</p>
                        <p>Raça: {selectedRace}</p>
                        <p>Classe: {selectedClass}</p>
                        <p>Poderes: {powersDescription}</p>
                        <p>Origem: {origin}</p>
                        <div>
                            <button className="btn-step" onClick={handlePreviousStep}>Voltar</button>
                            <button className="btn-step" onClick={handleSendButton}>Concluir</button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="render-step">
            {renderStepContent()}
        </div>
    );
};

export default ChatbotResponses;
