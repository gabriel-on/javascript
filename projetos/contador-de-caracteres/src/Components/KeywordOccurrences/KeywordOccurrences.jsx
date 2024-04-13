import React, { useState, useEffect } from 'react';

function KeywordOccurrences({ text, keywords }) {
    const [occurrences, setOccurrences] = useState({});

    useEffect(() => {
        updateOccurrences(text, keywords);
    }, [text, keywords]);

    const updateOccurrences = (value, keywords) => {
        const keywordCounts = {};
        const words = value.trim().split(/\s+|[-—]/);
        words.forEach(word => {
            if (keywords.includes(word)) {
                keywordCounts[word] = (keywordCounts[word] || 0) + 1;
            }
        });
        setOccurrences(keywordCounts);
    };

    return (
        <div>
            <h3>Contagem de Ocorrências de Palavras-Chave</h3>
            <ul>
                {Object.entries(occurrences).map(([keyword, count]) => (
                    <li key={keyword}>{`${keyword}: ${count}`}</li>
                ))}
            </ul>
        </div>
    );
}

export default KeywordOccurrences;
