import React, { useState, useEffect } from "react";
import { ref, onValue, push, set } from 'firebase/database';
import { database } from "../../firebase/config";

const ChatbotResponses = ({ onSendMessage }) => {
    const [input, setInput] = useState("");
    const [response, setResponse] = useState("");
    const [isInputEmpty, setIsInputEmpty] = useState(true);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        setIsInputEmpty(input.trim() === "");
    }, [input]);

    useEffect(() => {
        if (input && input.trim() !== "") {
            setIsTyping(true);
            setTimeout(() => {
                searchResponseInDatabase(input.trim().toLowerCase());
            }, 2000);
        }
    }, [input]);

    const greetingsKeywords = ["oi", "olá", "bom dia", "boa tarde", "boa noite"];
    const farewellKeywords = ["tchau", "até mais", "adeus", "fui"];
    const thankYouKeywords = ["obrigado", "valeu", "agradeço"];
    const questionKeywords = ["como", "o que", "quem", "onde", "quando", "por que"];
    const mathKeywords = ["+", "-", "*", "/", "^", "(", ")"];

    const searchResponseInDatabase = (userInput) => {
        // Primeiro, tenta encontrar uma resposta com base nas palavras-chave no banco de dados
        const responsesRef = ref(database, 'responses');

        onValue(responsesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const matchingResponse = Object.values(data).find(response => response.keywords.some(keyword => userInput.includes(keyword)));
                if (matchingResponse) {
                    setResponse(matchingResponse.text);
                    setIsTyping(false);
                    return; // Sai da função se encontrar uma resposta no banco de dados
                }
            }

            // Se não encontrar uma resposta no banco de dados, usa a lógica padrão
            let foundResponse = "";
            if (containsKeywords(userInput, greetingsKeywords)) {
                foundResponse = getGreetingResponse();
            } else if (containsKeywords(userInput, farewellKeywords)) {
                foundResponse = getFarewellResponse();
            } else if (containsKeywords(userInput, thankYouKeywords)) {
                foundResponse = getThankYouResponse();
            } else if (containsKeywords(userInput, questionKeywords)) {
                foundResponse = getQuestionResponse();
            } else if (containsKeywords(userInput, mathKeywords)) {
                foundResponse = handleMathQuestion(userInput);
            } else {
                foundResponse = getDefaultResponse();
            }

            setResponse(foundResponse);
            setIsTyping(false);
        });
    };


    const containsKeywords = (input, keywords) => {
        return keywords.some(keyword => input.includes(keyword));
    };

    const getGreetingResponse = () => {
        return "Olá! Como posso te ajudar?";
    };

    const getFarewellResponse = () => {
        return "Até mais! Espero ter ajudado.";
    };

    const getThankYouResponse = () => {
        return "De nada! Estou aqui para ajudar.";
    };

    const getQuestionResponse = () => {
        return "Essa é uma ótima pergunta! Vou verificar e te retornar em breve.";
    };

    const resolveExpressao = (expressao) => {
        try {
            // Realiza uma análise léxica básica para separar os operadores e operandos
            const tokens = expressao.match(/([-+*/()]|\d+(?:\.\d+)?)/g);

            // Verifica se a expressão é válida
            if (!tokens) {
                throw new Error("Expressão inválida");
            }

            // Cria uma pilha para realizar a avaliação da expressão
            const pilha = [];
            let operadorAnterior = null;

            for (let token of tokens) {
                if (['+', '-', '*', '/'].includes(token)) {
                    operadorAnterior = token;
                } else {
                    const numero = parseFloat(token);
                    if (operadorAnterior === null || operadorAnterior === '+' || operadorAnterior === '-') {
                        pilha.push(numero);
                    } else if (operadorAnterior === '*') {
                        const operandoAnterior = pilha.pop();
                        pilha.push(operandoAnterior * numero);
                    } else if (operadorAnterior === '/') {
                        const operandoAnterior = pilha.pop();
                        pilha.push(operandoAnterior / numero);
                    }
                }
            }

            // Calcula o resultado final
            let resultado = 0;
            for (let valor of pilha) {
                resultado += valor;
            }

            return resultado;
        } catch (error) {
            return "Erro ao resolver a expressão: " + error.message; // Retorna uma mensagem de erro
        }
    };

    const handleMathQuestion = (userInput) => {
        try {
            const result = resolveExpressao(userInput); // Avalia a expressão matemática
            return `O resultado é ${result}`;
        } catch (error) {
            return "Desculpe, não consegui calcular. Por favor, verifique a expressão matemática.";
        }
    };

    const getDefaultResponse = () => {
        return "Desculpe, não entendi. Poderia reformular sua pergunta?";
    };

    const sendMessageToDatabase = (message) => {
        const botResponseRef = push(ref(database, 'messages'));
        set(botResponseRef, {
            text: message,
            timestamp: Date.now()
        });
    };

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleSendButton = () => {
        onSendMessage(input);
        sendMessageToDatabase(response);
        setInput("");
        setResponse("");
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