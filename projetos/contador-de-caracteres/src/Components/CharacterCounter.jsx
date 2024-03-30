import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import { saveAs as saveAsDocx } from 'file-saver';

function CharacterCounter() {
  const [text, setText] = useState('');
  const [countLetters, setCountLetters] = useState(true);
  const [countSpecialChars, setCountSpecialChars] = useState(true);
  const resultRef = useRef(null);

  const handleChange = (event) => {
    setText(event.target.value);
  };

  const handleCountLettersChange = () => {
    setCountLetters(!countLetters);
  };

  const handleCountSpecialCharsChange = () => {
    setCountSpecialChars(!countSpecialChars);
  };

  const countCharacters = () => {
    let count = 0;
    if (countLetters) {
      // Contar letras do alfabeto inglês e português
      count += text.replace(/[^a-zA-ZÀ-ú]/g, '').length;
    }
    if (countSpecialChars) {
      // Contar caracteres especiais
      count += text.replace(/[a-zA-Z0-9À-ú]/g, '').length;
    }
    return count;
  };

  const countWords = () => {
    const words = text.trim().split(/\s+/);
    return words.length;
  };

  const countLettersOnly = () => {
    return text.replace(/[^a-zA-Z]/g, '').length;
  };

  const countSpecialCharsOnly = () => {
    return text.replace(/[a-zA-Z0-9]/g, '').length;
  };

  const saveAsPDF = () => {
    if (!resultRef.current) return;

    const lines = text.split('\n');
    const lineHeight = 20; // ajuste conforme necessário
    const pageHeight = 600; // altura da página
    const doc = new jsPDF('p', 'pt', 'a4');
    let cursorY = 20;
    let totalLetters = countLettersOnly();
    let totalSpecialChars = countSpecialCharsOnly();
    let totalAll = totalLetters + totalSpecialChars;

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
    doc.text(`Total de letras e caracteres especiais: ${totalAll}`, 20, cursorY + 60);
    doc.text(`Total de palavras: ${countWords()}`, 20, cursorY + 80);

    doc.save('texto_editavel.pdf');
  };

  const saveAsTXT = () => {
    let totalLetters = countLettersOnly();
    let totalSpecialChars = countSpecialCharsOnly();
    let totalAll = totalLetters + totalSpecialChars;

    let txtContent = text + '\n\n';
    txtContent += `Total de letras: ${totalLetters}\n`;
    txtContent += `Total de caracteres especiais: ${totalSpecialChars}\n`;
    txtContent += `Total de letras e caracteres especiais: ${totalAll}\n`;
    txtContent += `Total de palavras: ${countWords()}`;

    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'texto_editavel.txt');
  };

  const saveAsDOCX = () => {
    let totalLetters = countLettersOnly();
    let totalSpecialChars = countSpecialCharsOnly();
    let totalAll = totalLetters + totalSpecialChars;

    let docxContent = text + '\n\n';
    docxContent += `Total de letras: ${totalLetters}\n`;
    docxContent += `Total de caracteres especiais: ${totalSpecialChars}\n`;
    docxContent += `Total de letras e caracteres especiais: ${totalAll}\n`;
    docxContent += `Total de palavras: ${countWords()}`;

    const element = document.createElement('a');
    const file = new Blob([docxContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    element.href = URL.createObjectURL(file);
    element.download = "texto_editavel.docx";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  return (
    <div>
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
      <p>Total de caracteres: {countCharacters()}</p>
      <p>Total de palavras: {countWords()}</p>
      <button onClick={saveAsPDF}>Salvar como PDF</button>
      <button onClick={saveAsTXT}>Salvar como TXT</button>
      <button onClick={saveAsDOCX}>Salvar como DOCX</button>
      <div ref={resultRef}>
        {/* Não é necessário renderizar o texto aqui */}
      </div>
    </div>
  );
}

export default CharacterCounter;