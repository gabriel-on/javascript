import { useState, useEffect } from "react";
import { ref, onValue } from 'firebase/database';

const useCharacterSheetCreator = (userInput, database) => {
    const [response, setResponse] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [characterSheet, setCharacterSheet] = useState({});
    const [currentStep, setCurrentStep] = useState(0); 
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});

    useEffect(() => {
        setIsTyping(true);

        const steps = [
            { key: 'name', question: "Qual é o nome do seu personagem?" },
            { key: 'class', question: "Qual é a classe do seu personagem?" },
            { key: 'race', question: "Qual é a raça do seu personagem?" },
            // Adicione mais perguntas para cada aspecto da ficha do personagem
        ];

        setQuestions(steps);
        setResponse(steps[currentStep]?.question);
        
        return () => {}; 
    }, [currentStep]);

    useEffect(() => {
        if (userInput && currentStep < questions.length) {
            handleUserResponse(userInput);
        }
    }, [userInput]);

    const handleUserResponse = (userInput) => {
        const currentQuestion = questions[currentStep];
        const answer = userInput.trim();

        if (currentStep === 0 && !answer) {
            setResponse("Por favor, forneça um nome para o seu personagem.");
            return;
        }

        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [currentQuestion.key]: answer
        }));

        if (currentStep < questions.length - 1) {
            setCurrentStep(prevStep => prevStep + 1);
        } else {
            setIsTyping(false);
            setCharacterSheet(answers);
            setResponse("Ficha de personagem criada com sucesso!");
        }
    };

    return { response, isTyping, characterSheet, handleUserResponse };
};

export default useCharacterSheetCreator;
