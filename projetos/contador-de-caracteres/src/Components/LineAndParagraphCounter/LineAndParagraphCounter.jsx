import React, { useState, useEffect } from 'react';

function LineAndParagraphCounter({ text }) {
    const [totalLines, setTotalLines] = useState(0);
    const [totalParagraphs, setTotalParagraphs] = useState(0);

    useEffect(() => {
        updateCounters(text);
    }, [text]);

    const updateCounters = (value) => {
        const lines = value.split('\n');
        const paragraphs = value.split('\n\n').filter(para => para.trim() !== ''); // Filtrar parágrafos vazios

        setTotalLines(lines.length);
        setTotalParagraphs(paragraphs.length);
    };

    return (
        <div>
            <p>Total de linhas: {totalLines}</p>
            <p>Total de parágrafos: {totalParagraphs}</p>
        </div>
    );
}

export default LineAndParagraphCounter;
