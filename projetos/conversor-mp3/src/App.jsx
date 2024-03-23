import React, { useState } from 'react';
import axios from 'axios';

const ConversorVideoParaMP3 = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [mp3Link, setMp3Link] = useState('');

  const handleFileChange = (event) => {
    setVideoFile(event.target.files[0]);
  };

  const handleConvert = async () => {
    if (!videoFile) {
      console.error('Nenhum arquivo selecionado.');
      return;
    }

    const formData = new FormData();
    formData.append('video', videoFile);

    try {
      const response = await axios.post('/converter', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setMp3Link(response.data.mp3Link);
    } catch (error) {
      console.error('Erro ao converter vídeo:', error);
    }
  };

  return (
    <div>
      <input type="file" accept="video/*" onChange={handleFileChange} />
      <button onClick={handleConvert}>Converter para MP3</button>
      {mp3Link && (
        <div>
          <p>Link para download do MP3:</p>
          <a href={mp3Link} download>Download MP3</a>
        </div>
      )}
    </div>
  );
};

export default ConversorVideoParaMP3;
