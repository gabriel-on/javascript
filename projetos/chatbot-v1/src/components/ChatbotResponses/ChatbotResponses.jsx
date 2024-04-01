import React, { useState, useEffect } from "react";
import { ref, onValue, push } from 'firebase/database';
import { database } from "../../firebase/config";
import '../Chatbot/Chatbot.css';

const ChatbotResponses = ({ onSendMessage, onSaveResult }) => {
    const [step, setStep] = useState(1);
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState("");
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
    const [name, setName] = useState(""); // Novo estado para o nome

    useEffect(() => {
        const classesRef = ref(database, 'classes');
        onValue(classesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const classList = Object.values(data);
                setClasses(classList);
            }
        });
    }, []);

    const handleSelectClass = (className) => {
        setSelectedClass(className);
    };

    const handleNextStep = () => {
        setStep(step + 1);
    };

    const handleSendButton = () => {
        if (step < 4) {
            handleNextStep();
        } else {
            onSaveResult(selectedClass, attributes, name); // Inclui o nome ao enviar o resultado
        }
    };

    const handleAttributeChange = (attribute, value) => {
        setAttributes(prevAttributes => ({
            ...prevAttributes,
            [attribute]: value
        }));
    };

    const renderClasses = () => {
        return classes.map((className, index) => (
            <button key={index} onClick={() => handleSelectClass(className)}>{className}</button>
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
                        <h2>Etapa 1: Informe seu nome</h2>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Digite seu nome"
                        />
                        <button onClick={handleNextStep}>Próxima Etapa</button>
                    </div>
                );
            case 2:
                return (
                    <div>
                        <h2>Etapa 2: Distribua os pontos de atributo</h2>
                        {renderAttributes()}
                        <button onClick={handleNextStep}>Próxima Etapa</button>
                    </div>
                );
            case 3:
                return (
                    <div>
                        <h2>Etapa 3: Escolha sua classe</h2>
                        {renderClasses()}
                        <button onClick={handleNextStep}>Próxima Etapa</button>
                    </div>
                );
            case 4:
                return (
                    <div>
                        <h2>Etapa 4: Escolha suas habilidades</h2>
                        {/* Opções para escolher as habilidades */}
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
