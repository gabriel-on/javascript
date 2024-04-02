import { useState, useEffect } from "react";
import { ref, onValue } from 'firebase/database';

const useChatbotLogic = (userInput, database) => {
    const [response, setResponse] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [currentContext, setCurrentContext] = useState(""); // Estado para controlar o contexto atual

    useEffect(() => {
        setIsTyping(true);

        // Defina os contextos disponíveis
        const contexts = {
            GREETING: 'greeting',
            HEALTH_QUERY: 'health_query',
            WEATHER_QUERY: 'weather_query',
            // Adicione mais contextos conforme necessário
        };

        // Função para selecionar uma resposta com base no contexto
        const selectResponseByContext = (responses, context) => {
            return responses.find(response => response.context === context);
        };

        // Lógica para determinar o contexto com base na entrada do usuário usando uma árvore de decisão
        const determineContext = (userInput) => {
            // Verifique primeiro se a entrada do usuário contém palavras-chave específicas para cada contexto
            if (userInput.includes('saúde')) {
                if (userInput.includes('nutrição')) {
                    return contexts.HEALTH_QUERY;
                } else if (userInput.includes('exercício')) {
                    return contexts.HEALTH_QUERY;
                }
                return contexts.HEALTH_QUERY;
            } else if (userInput.includes('clima')) {
                return contexts.WEATHER_QUERY;
            }
            // Se não corresponder a nenhum contexto específico, retorne o contexto padrão
            return contexts.GREETING;
        };

        const databaseRef = ref(database, 'responses');
        const unsubscribe = onValue(databaseRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const matchingResponses = Object.values(data).filter(response => response.keywords.some(keyword => userInput.includes(keyword)));

                let foundResponse = "";
                if (matchingResponses.length > 0) {
                    // Determinar o contexto prioritário com base na entrada do usuário
                    const prioritizedContext = determineContext(userInput);
                    const availableResponses = matchingResponses.filter(response => response.context === prioritizedContext);
                    const selectedResponse = selectResponseByContext(availableResponses, prioritizedContext);

                    if (selectedResponse) {
                        setResponse(selectedResponse.text);
                        setIsTyping(false);
                        return;
                    } else {
                        foundResponse = matchingResponses[0].text;
                    }
                } else {
                    // Lógica de resposta padrão
                    foundResponse = getDefaultResponse();
                }

                setResponse(foundResponse);
                setIsTyping(false);
            }
        });

        // Determine o contexto ao iniciar o componente ou quando o usuário inserir uma nova entrada
        setCurrentContext(determineContext(userInput));

        return () => unsubscribe();
    }, [userInput, database, currentContext]); // Adicione currentContext como dependência do useEffect

    // Funções de respostas
    const getDefaultResponse = () => {
        return "Desculpe, não entendi. Poderia reformular sua pergunta?";
    };

    return { response, setResponse, isTyping };
};

export default useChatbotLogic;
