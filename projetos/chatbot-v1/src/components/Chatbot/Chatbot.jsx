import React, { useState, useEffect } from "react";
import { ref, onValue, push, set } from 'firebase/database';
import { database } from "../../firebase/config";
import ChatbotResponses from "../ChatbotResponses/ChatbotResponses";
import '../Chatbot/Chatbot.css'

const Chatbot = () => {
    const [messages, setMessages] = useState([]);

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
        sendMessage(message); // Envia a mensagem do usuário para o banco de dados
    };

    const sendMessage = (message) => {
        if (!message || message.trim() === "") return; // Verifica se a mensagem é válida
    
        const messagesRef = ref(database, 'messages');
        const newMessageRef = push(messagesRef);
        set(newMessageRef, {
            text: message.trim(),
            timestamp: Date.now(),
            type: "user" // Indicador de mensagem do usuário
        });

        console.log("Mensagem do usuário enviada:", message); // Log da mensagem do usuário
    };

    return (
        <div>
            <div className="chat-message" style={{ height: "400px", overflowY: "scroll" }}>
                {messages.map((message, index) => (
                    <div key={index} className={message.type === "user" ? "user-message" : "bot-message"}>
                        {message.text}
                    </div>
                ))}
            </div>
            <div>
                <ChatbotResponses
                    onSendMessage={handleUserMessageChange}
                />
            </div>
        </div>
    );
};

export default Chatbot;
