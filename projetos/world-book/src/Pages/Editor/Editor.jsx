import React, { useState } from 'react';
import Toolbar from '../../components/Toolbar/Toolbar';
import ImageUploader from '../../components/ImageUploader/ImageUploader';

const Editor = () => {
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const handleBoldClick = () => {
    setBold(!bold);
  };

  const handleItalicClick = () => {
    setItalic(!italic);
  };

  const handleUnderlineClick = () => {
    setUnderline(!underline);
  };

  const handleInsertImage = (imageData) => {
    console.log('Dados da imagem:', imageData);
  };

  const handleInsertLink = (url) => {
    // Aqui você pode manipular a inserção do link, como inseri-lo no conteúdo do editor
    // Por enquanto, apenas exibiremos o URL do link no console
    console.log('URL do link:', url);
  };

  return (
    <div>
      <Toolbar 
        onBoldClick={handleBoldClick}
        onItalicClick={handleItalicClick}
        onUnderlineClick={handleUnderlineClick}
        onInsertImageClick={handleInsertImage}
        onInsertLinkClick={handleInsertLink} // Adicionando a função para manipular a inserção de links
      />
      <div className="editor">
        <ImageUploader/>
        <textarea 
          style={{
            fontWeight: bold ? 'bold' : 'normal',
            fontStyle: italic ? 'italic' : 'normal',
            textDecoration: underline ? 'underline' : 'none'
          }}
        />
      </div>
    </div>
  );
};

export default Editor;
