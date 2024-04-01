import React, { useState, useEffect } from "react";
import { ref, onValue, push, query, orderByKey, limitToLast } from 'firebase/database'; // Importação da função query adicionada
import { database } from "../../firebase/config";
import ChatbotResponses from "../ChatbotResponses/ChatbotResponses";
import '../Chatbot/Chatbot.css';

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [result, setResult] = useState(null);
    const [characters, setCharacters] = useState([]);

    useEffect(() => {
        const charactersRef = ref(database, 'characters');
        onValue(charactersRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const characterList = Object.values(data);
                setCharacters(characterList);
            }
        });
    }, []);

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

    const handleUserMessageChange = (message) => {
        sendMessage(message);
    };

    const sendMessage = (message) => {
        if (!message || message.trim() === "") return;

        const messagesRef = ref(database, 'messages');
        const newMessageRef = push(messagesRef);
        set(newMessageRef, {
            text: message.trim(),
            timestamp: Date.now(),
            type: "user"
        });
    };

    const handleSaveResult = (selectedClass, attributes, characterName, selectedRace, age, origin) => {
        const resultRef = ref(database, 'result');
        push(resultRef, { selectedClass, attributes, characterName, selectedRace, age, origin });
        console.log("Resultado salvo no banco de dados:", { selectedClass, attributes, characterName, selectedRace, age, origin });
        
        fetchResult();
    };    

    const fetchResult = () => {
        const resultRef = ref(database, 'result');
        const resultQuery = query(resultRef, orderByKey(), limitToLast(1));
        onValue(resultQuery, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const resultData = Object.values(data)[0];
                setResult(resultData);
                console.log("Dados do resultado recuperados:", resultData);
            }
        });
    };

    return (
        <div>
            <div className="chat-message" style={{ height: "400px", width: "600px", overflowY: "scroll" }}>
                <ChatbotResponses
                    onSendMessage={handleUserMessageChange}
                    onSaveResult={handleSaveResult}
                />
            </div>
            {result && (
                <div>
                    <h1>Atributos do Personagem:</h1>
                    <h2>Nome: {result.characterName}</h2>
                    <h2>Classe: {result.selectedClass}</h2>
                    <h2>Raça: {result.selectedRace}</h2>
                    <h2>Idade: {result.age}</h2>
                    <h2>Origem: {result.origin}</h2>
                    <h3>Status:</h3>

                    <ul>
                        <li>
                            <p>Força: {result.attributes.Força}</p>
                        </li>
                        <li>
                            <p>Defesa: {result.attributes.Defesa}</p>
                        </li>
                        <li>
                            <p>Agilidade: {result.attributes.Agilidade}</p>
                        </li>
                        <li>
                            <p>Vigor: {result.attributes.Vigor}</p>
                        </li>
                        <li>
                            <p>Velocidade: {result.attributes.Velocidade}</p>
                        </li>
                        <li>
                            <p>Inteligência: {result.attributes.Inteligencia}</p>
                        </li>
                        <li>
                            <p>Poder: {result.attributes.Poder}</p>
                        </li>
                        <li>
                            <p>Destreza: {result.attributes.Destreza}</p>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );    
};

export default Chatbot;