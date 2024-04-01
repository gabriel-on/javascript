import React, { useState, useEffect } from "react";
import { ref, onValue, push } from 'firebase/database';
import { database } from "../../firebase/config";
import '../Chatbot/Chatbot.css';

const ChatbotResponses = ({ onSaveResult }) => {
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

    const handleSendButton = () => {
        if (step === 6) {
            onSaveResult(selectedClass, attributes, characterName, selectedRace, age);
        } else {
            handleNextStep();
        }
    };

    const handleAttributeChange = (attribute, value) => {
        setAttributes(prevAttributes => ({
            ...prevAttributes,
            [attribute]: value
        }));
    };

    const handleNameChange = (event) => {
        setCharacterName(event.target.value);
    };

    const handleAgeChange = (event) => {
        const value = event.target.value.replace(/\D/, ''); // Somente números
        setAge(value);
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
        switch (step) {
            case 1:
                return (
                    <div>
                        <h2>Etapa 1: Insira o nome do personagem</h2>
                        <input type="text" value={characterName} onChange={handleNameChange} />
                        <button onClick={handleNextStep}>Próxima Etapa</button>
                    </div>
                );
            case 2:
                return (
                    <div>
                        <h2>Etapa 2: Insira a idade do personagem</h2>
                        <input type="text" value={age} onChange={handleAgeChange} />
                        <button onClick={handleNextStep}>Próxima Etapa</button>
                    </div>
                );
            case 3:
                return (
                    <div>
                        <h2>Etapa 3: Escolha a raça do personagem</h2>
                        {renderRaces()}
                        <button onClick={handleNextStep}>Próxima Etapa</button>
                    </div>
                );
            case 4:
                return (
                    <div>
                        <h2>Etapa 4: Distribua os pontos de atributo</h2>
                        {renderAttributes()}
                        <button onClick={handleNextStep}>Próxima Etapa</button>
                    </div>
                );
            case 5:
                return (
                    <div>
                        <h2>Etapa 5: Escolha sua classe</h2>
                        {renderClasses()}
                        <button onClick={handleNextStep}>Próxima Etapa</button>
                    </div>
                );
            case 6:
                return (
                    <div>
                        <h2>Etapa Final: Confirme os dados e conclua</h2>
                        <p>Nome: {characterName}</p>
                        <p>Idade: {age}</p>
                        <p>Raça: {selectedRace}</p>
                        <p>Classe: {selectedClass}</p>
                        <button onClick={handleSendButton}>Concluir</button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="">
            {renderStepContent()}
        </div>
    );
};

export default ChatbotResponses;
