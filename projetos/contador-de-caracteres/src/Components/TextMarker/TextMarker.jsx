import React, { useState } from 'react';

function TextMarker({ text }) {
    const [selection, setSelection] = useState({ start: 0, end: 0 });

    const handleSelection = () => {
        const selectedText = window.getSelection().toString();
        const selectionStart = window.getSelection().anchorOffset;
        const selectionEnd = window.getSelection().focusOffset;

        setSelection({ start: selectionStart, end: selectionEnd });
        console.log('Selected Text:', selectedText);
    };

    const applyBold = () => {
        // Implemente a lógica para aplicar negrito ao texto selecionado
        console.log('Applying Bold...');
    };

    const applyItalic = () => {
        // Implemente a lógica para aplicar itálico ao texto selecionado
        console.log('Applying Italic...');
    };

    const applyUnderline = () => {
        // Implemente a lógica para aplicar sublinhado ao texto selecionado
        console.log('Applying Underline...');
    };

    return (
        <div onMouseUp={handleSelection}>
            <p>{text}</p>
            <div>
                <button onClick={applyBold}>Bold</button>
                <button onClick={applyItalic}>Italic</button>
                <button onClick={applyUnderline}>Underline</button>
            </div>
        </div>
    );
}

export default TextMarker;
