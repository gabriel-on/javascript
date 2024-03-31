import React from 'react';

const Toolbar = ({ onBoldClick, onItalicClick, onUnderlineClick, onInsertImageClick, onInsertLinkClick }) => {
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const imageData = reader.result;
      onInsertImageClick(imageData);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleInsertLink = () => {
    const url = prompt('Insira o URL do link:');
    if (url) {
      onInsertLinkClick(url);
    }
  };

  return (
    <div className="toolbar">
      <button onClick={onBoldClick}><strong>B</strong></button>
      <button onClick={onItalicClick}><em>I</em></button>
      <button onClick={onUnderlineClick}><u>U</u></button>
      <label htmlFor="image-upload" className="toolbar-button">Inserir Imagem</label>
      <input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
      <button onClick={handleInsertLink}>Inserir Link</button>
    </div>
  );
};

export default Toolbar;
