import React, { useState, useEffect } from "react";
import { ref, onValue, push, query, orderByKey, limitToLast } from 'firebase/database';
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
        push(messagesRef, {
            text: message.trim(),
            timestamp: Date.now(),
            type: "user"
        });
    };

    const handleSaveResult = (selectedClass, attributes, characterName, selectedRace, age, origin, createdBy, createdAt, powersDescription) => {
        const resultRef = ref(database, 'result');
        push(resultRef, { selectedClass, attributes, characterName, selectedRace, age, origin, createdBy, createdAt, powersDescription });
        console.log("Resultado salvo no banco de dados:", { selectedClass, attributes, characterName, selectedRace, age, origin, createdBy, createdAt, powersDescription });

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

    const exportResult = () => {
        if (result) {
            // Transforme o objeto result em JSON
            const jsonResult = JSON.stringify(result);
            // Crie um elemento <a> para download
            const element = document.createElement('a');
            element.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(jsonResult);
            element.download = 'resultado.json';
            element.click();
        }
    };

    return (
        <div className="panel-container">
            <div className="chat-message">
                <ChatbotResponses
                    onSendMessage={handleUserMessageChange}
                    onSaveResult={handleSaveResult}
                />
            </div>
            {result && (
                <div className="final-result">
                    <div>
                        <h2>Detalhes do Personagem:</h2>
                        <table>
                            <tbody>
                                <tr>
                                    <td>Nome:</td>
                                    <td>{result.characterName}</td>
                                </tr>
                                <tr>
                                    <td>Classe:</td>
                                    <td>{result.selectedClass}</td>
                                </tr>
                                <tr>
                                    <td>Raça:</td>
                                    <td>{result.selectedRace}</td>
                                </tr>
                                <tr>
                                    <td>Idade:</td>
                                    <td>{result.age}</td>
                                </tr>
                                <tr>
                                    <td>Origem:</td>
                                    <td>{result.origin}</td>
                                </tr>
                                <tr>
                                    <td>Poderes:</td>
                                    <td>{result.powersDescription}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <h2>Atributos do Personagem:</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Atributo</th>
                                    <th>Pontos</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(result.attributes).map(([attribute, value]) => (
                                    <tr key={attribute}>
                                        <td>{attribute}</td>
                                        <td>{value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Botão para exportar o resultado */}
                    <button onClick={exportResult}>Exportar Resultado em JSON</button>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
