import React, { useState, useEffect } from "react";
import { database } from "../../firebase/config";
import { ref, onValue, push, set } from 'firebase/database';

import StepCharacterName from "../StepCharacterName/StepCharacterName.jsx";
import StepCharacterClass from "../StepCharacterClass/StepCharacterClass.jsx";
import StepCharacterLevel from "../StepCharacterLevel/StepCharacterLevel.jsx";

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [step, setStep] = useState(1);
    const [characterName, setCharacterName] = useState("");
    const [characterClass, setCharacterClass] = useState("");
    const [characterLevel, setCharacterLevel] = useState("");
    const [input, setInput] = useState("");

    useEffect(() => {
        const messagesRef = ref(database, 'messages');
        onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const messageList = Object.values(data);
                setMessages(messageList);
            }
        });
    }, []);

    const handleSendMessage = () => {
        if (input.trim() === "") return;

        const messagesRef = ref(database, 'messages');
        const newMessageRef = push(messagesRef);
        set(newMessageRef, {
            text: input.trim(),
            timestamp: Date.now()
        });

        handleUserInput(input.trim().toLowerCase());

        setInput("");
    };

    const handleUserInput = (userInput) => {
        switch (step) {
            case 1:
                setCharacterName(userInput);
                setStep(step + 1);
                break;
            case 2:
                setCharacterClass(userInput);
                setStep(step + 1);
                break;
            case 3:
                setCharacterLevel(userInput);
                saveCharacter();
                break;
            default:
                // Other steps or default behavior
                break;
        }
    };

    const saveCharacter = () => {
        // Chamar a função de criação de personagem aqui
        console.log("Criar personagem com os seguintes detalhes:");
        console.log("Nome:", characterName);
        console.log("Classe:", characterClass);
        console.log("Nível:", characterLevel);

        // Reiniciar o fluxo para a próxima interação
        setStep(1);
        setCharacterName("");
        setCharacterClass("");
        setCharacterLevel("");
    };

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    return (
        <div>
            <div style={{ height: "400px", overflowY: "scroll" }}>
                {messages.map((message, index) => (
                    <div key={index}>
                        {message.text}
                    </div>
                ))}
            </div>
            <div>
                {step === 1 && (
                    <StepCharacterName
                        value={characterName}
                        onChange={(e) => setCharacterName(e.target.value)}
                    />
                )}
                {step === 2 && (
                    <StepCharacterClass
                        value={characterClass}
                        onChange={(e) => setCharacterClass(e.target.value)}
                    />
                )}
                {step === 3 && (
                    <StepCharacterLevel
                        value={characterLevel}
                        onChange={(e) => setCharacterLevel(e.target.value)}
                    />
                )}
                <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Digite sua mensagem..."
                    style={{ marginRight: "10px" }}
                />
                <button onClick={handleSendMessage}>Enviar</button>
            </div>
        </div>
    );
};

export default Chatbot;