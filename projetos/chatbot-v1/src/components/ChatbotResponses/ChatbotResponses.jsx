import React, { useState, useEffect } from "react";
import { ref, push, set } from 'firebase/database';
import { database } from "../../firebase/config";
import useChatbotLogic from "../../hook/useChatbotLogic";

const ChatbotResponses = ({ onSendMessage }) => {
    const [input, setInput] = useState("");
    const [isInputEmpty, setIsInputEmpty] = useState(true);
    const { response, isTyping, setResponse } = useChatbotLogic(input, database); // Adicionando setResponse ao retorno do hook

    useEffect(() => {
        setIsInputEmpty(input.trim() === "");
    }, [input]);

    const sendMessageToDatabase = (message) => {
        const botResponseRef = push(ref(database, 'messages'));
        set(botResponseRef, {
            text: message,
            timestamp: Date.now()
        }).then(() => {
            // Limpar a resposta após o envio bem-sucedido
            setResponse(""); // Agora setResponse está definido e pode ser utilizado
        }).catch(error => {
            console.error("Erro ao enviar mensagem para o banco de dados:", error);
        });
    };

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleSendButton = () => {
        onSendMessage(input);
        sendMessageToDatabase(response); // Enviando a resposta para o banco de dados
        setInput("");
    };

    return (
        <div>
            {isTyping && <div>Digitando...</div>}
            <input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="Digite sua mensagem..."
                style={{ marginRight: "10px" }}
            />
            <button
                onClick={handleSendButton}
                disabled={isInputEmpty}>Enviar</button>
        </div>
    );
};

export default ChatbotResponses;
