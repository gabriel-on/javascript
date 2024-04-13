import React, { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import LineAndParagraphCounter from '../LineAndParagraphCounter/LineAndParagraphCounter';
import FrequencyStatistics from '../FrequencyStatistics/FrequencyStatistics';
import { useTheme } from '../../Context/ThemeContext';
import '../CharacterCounter/CharacterCounter.css'

function CharacterCounter() {
    const [text, setText] = useState('');
    const [countLetters, setCountLetters] = useState(true);
    const [countSpecialChars, setCountSpecialChars] = useState(true);
    const [totalCharacters, setTotalCharacters] = useState(0);
    const [totalWords, setTotalWords] = useState(0);
    const resultRef = useRef(null);
    const [showStatistics, setShowStatistics] = useState(false);
    const { theme, toggleTheme } = useTheme();

    // Recalculate totals when text, countLetters, or countSpecialChars change
    useEffect(() => {
        updateCounters(text);
    }, [text, countLetters, countSpecialChars]);

    const toggleStatistics = () => {
        setShowStatistics(prevState => !prevState);
    };

    const handleChange = (event) => {
        setText(event.target.value);
    };

    const handleCountLettersChange = () => {
        setCountLetters(prevState => !prevState);
    };

    const handleCountSpecialCharsChange = () => {
        setCountSpecialChars(prevState => !prevState);
    };

    const updateCounters = (value) => {
        let totalLetters = countLetters ? countLettersOnly(value) : 0;
        let totalSpecialChars = countSpecialChars ? countSpecialCharsOnly(value) : 0;
        setTotalCharacters(totalLetters + totalSpecialChars);
        setTotalWords(countWords(value));
    };

    const countLettersOnly = (value) => {
        return value.replace(/[^a-zA-Z]/g, '').length;
    };

    const countSpecialCharsOnly = (value) => {
        return value.replace(/[a-zA-Z0-9]/g, '').length;
    };

    const countWords = (value) => {
        const words = value.trim().split(/\s+|[-—]/);
        return words.filter(word => word !== '').length;
    };

    const saveAsPDF = () => {
        if (!resultRef.current) return;

        if (text.trim() === '') {
            alert('Digite algum texto antes de salvar.');
            return;
        }

        let totalLetters = countLetters ? countLettersOnly(text) : 0;
        let totalSpecialChars = countSpecialChars ? countSpecialCharsOnly(text) : 0;

        const lines = text.split('\n');
        const lineHeight = 20; // ajuste conforme necessário
        const pageHeight = 600; // altura da página
        const doc = new jsPDF('p', 'pt', 'a4');
        let cursorY = 20;

        const addPageIfNeeded = () => {
            if (cursorY > pageHeight) {
                doc.addPage();
                cursorY = 20;
            }
        };

        // Estilo de texto
        doc.setFont('Arial');
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0); // Cor preta

        lines.forEach((line) => {
            const words = line.split(' ');
            const lines = [];

            let currentLine = words.shift();
            words.forEach((word) => {
                const width = doc.getStringUnitWidth(currentLine + ' ' + word) * 12; // ajuste conforme necessário

                if (width < doc.internal.pageSize.getWidth() - 40) {
                    currentLine += ' ' + word;
                } else {
                    lines.push(currentLine);
                    currentLine = word;
                }
            });

            lines.push(currentLine);
            lines.forEach((line) => {
                addPageIfNeeded();
                doc.text(20, cursorY, line);
                cursorY += lineHeight;
            });
        });

        doc.text(`Total de letras: ${totalLetters}`, 20, cursorY + 20);
        doc.text(`Total de caracteres especiais: ${totalSpecialChars}`, 20, cursorY + 40);
        doc.text(`Total de letras e caracteres especiais: ${totalLetters + totalSpecialChars}`, 20, cursorY + 60);
        doc.text(`Total de palavras: ${countWords(text)}`, 20, cursorY + 80);

        doc.save('seu_texto.pdf');
    };

    const saveAsTXT = () => {
        if (text.trim() === '') {
            alert('Digite algum texto antes de salvar.');
            return;
        }

        let totalLetters = countLetters ? countLettersOnly(text) : 0;
        let totalSpecialChars = countSpecialChars ? countSpecialCharsOnly(text) : 0;

        let txtContent = text + '\n\n';
        txtContent += `Total de letras: ${totalLetters}\n`;
        txtContent += `Total de caracteres especiais: ${totalSpecialChars}\n`;
        txtContent += `Total de letras e caracteres especiais: ${totalLetters + totalSpecialChars}\n`;
        txtContent += `Total de palavras: ${countWords(text)}`;

        const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, 'seu_texto.txt');
    };

    const saveAsDOCX = () => {
        if (text.trim() === '') {
            alert('Digite algum texto antes de salvar.');
            return;
        }

        let totalLetters = countLetters ? countLettersOnly(text) : 0;
        let totalSpecialChars = countSpecialChars ? countSpecialCharsOnly(text) : 0;

        let docxContent = text + '\n\n';
        docxContent += `Total de letras: ${totalLetters}\n`;
        docxContent += `Total de caracteres especiais: ${totalSpecialChars}\n`;
        docxContent += `Total de letras e caracteres especiais: ${totalLetters + totalSpecialChars}\n`;
        docxContent += `Total de palavras: ${countWords(text)}`;

        const element = document.createElement('a');
        const file = new Blob([docxContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        element.href = URL.createObjectURL(file);
        element.download = "seu_texto.docx";
        document.body.appendChild(element);
        element.click();
    };

    return (
        <div className={`container ${theme}`}>
            <textarea
                value={text}
                onChange={handleChange}
                placeholder="Digite seu texto aqui..."
                rows={4}
                cols={50}
            />
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={countLetters}
                        onChange={handleCountLettersChange}
                    />
                    Contar letras
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={countSpecialChars}
                        onChange={handleCountSpecialCharsChange}
                    />
                    Contar caracteres especiais
                </label>
            </div>
            <p>Total de caracteres: {totalCharacters}</p>
            <p>Total de palavras: {totalWords}</p>
            <LineAndParagraphCounter text={text} />
            <button onClick={toggleStatistics}>
                {showStatistics ? "Esconder Estatísticas" : "Mostrar Estatísticas"}
            </button>
            {showStatistics && (
                <div>
                    <FrequencyStatistics text={text} />
                </div>
            )}
            <div className='btns'>
                <button onClick={toggleTheme}>Tema</button>
                <button onClick={saveAsPDF}>Salvar como PDF</button>
                <button onClick={saveAsTXT}>Salvar como TXT</button>
                <button onClick={saveAsDOCX}>Salvar como DOCX</button>
            </div>
            <div ref={resultRef}>
                {/* Não é necessário renderizar o texto aqui */}
            </div>
        </div>
    );
}

export default CharacterCounter;