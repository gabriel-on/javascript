import React, { useState } from 'react';

function TextMarker({ text, onStyleChange }) {
    const [selection, setSelection] = useState({ start: 0, end: 0 });

    const handleSelection = () => {
        const selectedText = window.getSelection().toString();
        const selectionStart = window.getSelection().anchorOffset;
        const selectionEnd = window.getSelection().focusOffset;

        setSelection({ start: selectionStart, end: selectionEnd });
        console.log('Selected Text:', selectedText);
    };

    const applyStyle = (style) => {
        const selectedText = window.getSelection().toString();
        const textNode = document.createTextNode(selectedText);

        const range = window.getSelection().getRangeAt(0);
        range.deleteContents();
        range.insertNode(textNode);

        const span = document.createElement('span');
        span.style[style] = 'true';
        span.appendChild(textNode);

        range.insertNode(span);
        console.log(`Applying ${style}...`);
        
        // Chama a função onStyleChange passando o estilo e o texto selecionado
        onStyleChange(style, selectedText);
    };

    return (
        <div onMouseUp={handleSelection} style={{ userSelect: 'text' }}>
            <p>{text}</p>
            <div>
                <button onClick={() => applyStyle('fontWeight')}>Bold</button>
                <button onClick={() => applyStyle('fontStyle')}>Italic</button>
                <button onClick={() => applyStyle('textDecoration')}>Underline</button>
            </div>
        </div>
    );
}

export default TextMarker;