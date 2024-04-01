import { useState, useEffect } from "react";
import { ref, onValue } from 'firebase/database';

const useChatbotLogic = (userInput, database) => {
    const [response, setResponse] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        setIsTyping(true);

        const greetingsKeywords = ["oi", "olá", "bom dia", "boa tarde", "boa noite"];
        const farewellKeywords = ["tchau", "até mais", "adeus", "fui"];
        const thankYouKeywords = ["obrigado", "valeu", "agradeço"];
        const questionKeywords = ["como", "o que", "quem", "onde", "quando", "por que"];
        const mathKeywords = ["+", "-", "*", "/", "^", "(", ")"];

        const synonyms = {
            "saúde": ["bem-estar", "condição física", "saúde mental"],
            // Adicione mais sinônimos conforme necessário
        };

        const addVariation = (responseText) => {
            const words = responseText.split(" ");
            const variedWords = words.map(word => {
                if (synonyms[word]) {
                    return synonyms[word][Math.floor(Math.random() * synonyms[word].length)];
                }
                return word;
            });
            return variedWords.join(" ");
        };

        const reorderSentence = (responseText) => {
            const sentences = responseText.split("."); // Supondo que cada frase termina com um ponto
            // Lógica para reordenar as frases, se necessário
            return sentences.join(". ");
        };

        const keywordWeights = {
            "saúde": 3,
            "bem-estar": 2,
            "nutrição": 2,
            "exercício": 2,
            "dieta": 2,
            "dormir": 1,
            // Adicione mais palavras-chave e pesos conforme necessário
        };

        const calculateFrequencyScore = (responseText, userInput) => {
            const responseWords = responseText.split(" ");
            const userInputWords = userInput.split(" ");

            let frequencyScore = 0;

            userInputWords.forEach(userWord => {
                const frequency = responseWords.filter(word => word === userWord).length;
                frequencyScore += frequency;
            });

            return frequencyScore;
        };

        const prioritizeResponses = (responses, userInput) => {
            let prioritizedResponse = null;
            let maxScore = 0;

            // Contagem de ocorrências das palavras-chave e cálculo do escore de relevância
            responses.forEach(response => {
                let score = 0;
                response.keywords.forEach(keyword => {
                    if (userInput.includes(keyword)) {
                        score += keywordWeights[keyword] || 1; // Adiciona o peso da palavra-chave (ou 1 se não houver peso definido)
                    }
                });

                // Considerar outros fatores para o escore de relevância, como a frequência das palavras-chave
                const frequencyScore = calculateFrequencyScore(response.text, userInput);
                score += frequencyScore;

                if (score > maxScore) {
                    maxScore = score;
                    prioritizedResponse = response;
                }
            });

            return prioritizedResponse;
        };

        const combineResponses = (responses) => {
            if (responses.length === 0) {
                return null; // Retorna null se não houver respostas combinadas
            }

            let combinedText = responses.map(response => response.text).join(' '); // Concatena as respostas em uma única string
            combinedText = addVariation(combinedText); // Introduz variação nas palavras-chave
            combinedText = reorderSentence(combinedText); // Reordena as frases, se necessário
            return combinedText;
        };

        const databaseRef = ref(database, 'responses');
        const unsubscribe = onValue(databaseRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const matchingResponses = Object.values(data).filter(response => response.keywords.some(keyword => userInput.includes(keyword)));

                let foundResponse = "";
                if (matchingResponses.length > 0) {
                    const prioritizedResponse = prioritizeResponses(matchingResponses, userInput);
                    if (prioritizedResponse) {
                        setResponse(prioritizedResponse.text);
                        setIsTyping(false);
                        return;
                    }

                    const combinedResponse = combineResponses(matchingResponses);
                    if (combinedResponse) {
                        setResponse(combinedResponse);
                        setIsTyping(false);
                        return;
                    } else {
                        foundResponse = matchingResponses[0].text;
                    }
                } else {
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

        return () => unsubscribe();
    }, [userInput, database]);

    // Função containsKeywords
    const containsKeywords = (input, keywords) => {
        return keywords.some(keyword => input.includes(keyword));
    };

    // Funções de respostas
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

    return { response, setResponse, isTyping };
};

export default useChatbotLogic;