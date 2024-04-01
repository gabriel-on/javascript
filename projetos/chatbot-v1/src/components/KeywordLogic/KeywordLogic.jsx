import { ref, onValue } from 'firebase/database';

export const KeywordLogic = (userInput, databaseRef, setIsTyping, setResponse) => {
    const responsesRef = ref(databaseRef, 'responses');

    const greetingsKeywords = ["oi", "olá", "bom dia", "boa tarde", "boa noite"];
    const farewellKeywords = ["tchau", "até mais", "adeus", "fui"];
    const thankYouKeywords = ["obrigado", "valeu", "agradeço"];
    const questionKeywords = ["como", "o que", "quem", "onde", "quando", "por que"];
    const mathKeywords = ["+", "-", "*", "/", "^", "(", ")"];

    onValue(responsesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            const matchingResponses = Object.values(data).filter(response => response.keywords.some(keyword => userInput.includes(keyword)));

            let foundResponse = "";
            if (matchingResponses.length > 0) {
                // Priorizar as respostas com base nas palavras-chave encontradas
                const prioritizedResponse = prioritizeResponses(matchingResponses, userInput);
                if (prioritizedResponse) {
                    setResponse(prioritizedResponse.text);
                    setIsTyping(false);
                    return; // Sai da função após definir a resposta priorizada
                }

                // Combine as respostas se houver mais de uma resposta encontrada
                const combinedResponse = combineResponses(matchingResponses);
                if (combinedResponse) {
                    setResponse(combinedResponse);
                    setIsTyping(false);
                    return; // Sai da função após definir a resposta combinada
                } else {
                    // Se não houver respostas combinadas, use a primeira resposta encontrada
                    foundResponse = matchingResponses[0].text;
                }
            } else {
                // Se não encontrar uma resposta no banco de dados, use a lógica padrão
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
            }

            setResponse(foundResponse);
            setIsTyping(false);
        }
    });
};

const prioritizeResponses = (responses, userInput) => {
    let prioritizedResponse = null;
    let maxKeywordCount = 0;

    // Contagem de ocorrências das palavras-chave
    responses.forEach(response => {
        const keywordCount = response.keywords.filter(keyword => userInput.includes(keyword)).length;
        if (keywordCount > maxKeywordCount) {
            maxKeywordCount = keywordCount;
            prioritizedResponse = response;
        }
    });

    return prioritizedResponse;
};

const combineResponses = (responses) => {
    // Combine as respostas de alguma forma para criar uma resposta abrangente
    // Por exemplo, você pode concatenar as respostas ou criar uma resposta personalizada com base nas respostas encontradas
    if (responses.length === 0) {
        return null; // Retorna null se não houver respostas combinadas
    }

    const combinedText = responses.map(response => response.text).join(' '); // Concatena as respostas em uma única string
    return combinedText;
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

export { prioritizeResponses, combineResponses, containsKeywords, getGreetingResponse, getFarewellResponse, getThankYouResponse, getQuestionResponse, handleMathQuestion, getDefaultResponse };
