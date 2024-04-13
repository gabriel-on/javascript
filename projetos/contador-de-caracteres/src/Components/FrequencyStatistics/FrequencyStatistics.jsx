import React, { useState, useEffect } from 'react';

function FrequencyStatistics({ text }) {
    const [charFrequency, setCharFrequency] = useState({});
    const [wordFrequency, setWordFrequency] = useState({});

    useEffect(() => {
        updateStatistics(text);
    }, [text]);

    const updateStatistics = (value) => {
        const charFreq = countCharacterFrequency(value);
        const wordFreq = countWordFrequency(value);
        setCharFrequency(charFreq);
        setWordFrequency(wordFreq);
    };

    const countCharacterFrequency = (value) => {
        const frequency = {};
        const characters = value.replace(/\s/g, '').split('');
        characters.forEach(char => {
            frequency[char] = (frequency[char] || 0) + 1;
        });
        return frequency;
    };

    const countWordFrequency = (value) => {
        const frequency = {};
        const words = value.trim().split(/\s+|[-—]/);
        words.forEach(word => {
            frequency[word] = (frequency[word] || 0) + 1;
        });
        return frequency;
    };

    return (
        <div>
            <h3>Estatísticas de Frequência de Caracteres</h3>
            <ul>
                {Object.entries(charFrequency).map(([char, count]) => (
                    <li key={char}>{`"${char}": ${count}`}</li>
                ))}
            </ul>
            <h3>Estatísticas de Frequência de Palavras</h3>
            <ul>
                {Object.entries(wordFrequency).map(([word, count]) => (
                    <li key={word}>{`${word}: ${count}`}</li>
                ))}
            </ul>
        </div>
    );
}

export default FrequencyStatistics;
