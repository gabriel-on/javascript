import React, { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// CSS
import './CharacterImageUploader.css';

function CharacterImageUploader({ onUpload }) {
  const [characterImage, setCharacterImage] = useState(null);
  const [uploading, setUploading] = useState(false); // Estado para controlar a animação do botão
  const [selected, setSelected] = useState(false); // Estado para controlar se a imagem foi selecionada
  const [imagePreview, setImagePreview] = useState(null); // Estado para armazenar a miniatura da imagem
  const [uploadComplete, setUploadComplete] = useState(false); // Estado para controlar se o upload foi concluído

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setCharacterImage(file);
    checkSelected(file);
    // Criar a miniatura da imagem
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const checkSelected = (file) => {
    if (file) {
      setSelected(true); // Se a imagem for selecionada, define selected como true
    } else {
      setSelected(false); // Se nenhuma imagem for selecionada, define selected como false
    }
  };

  const handleUpload = async () => {
    const storage = getStorage();
    const imageRef = ref(storage, `characterImages/${characterImage.name}`);

    setUploading(true); // Ativar animação do botão

    try {
      await uploadBytes(imageRef, characterImage);

      const imageUrl = await getDownloadURL(imageRef);

      onUpload(imageUrl);

      setUploading(false); // Desativar animação do botão após o upload
      setSelected(false); // Resetar o estado da imagem selecionada
      setUploadComplete(true); // Definir upload como concluído
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      // Lidar com erros de upload aqui
    }
  };

  return (
    <div className='character-image-uploader-container'>
      <div className='character-image-uploader-item'>
        <h2>Imagem do Personagem</h2>
        <input type="file" onChange={handleImageChange} />
        {imagePreview && <img src={imagePreview} alt="Imagem do Personagem" className="preview-image" />}
      </div>
      <button onClick={handleUpload} className={`btn-character-image-upload ${uploading ? 'uploading' : ''} ${selected ? 'selected' : ''} ${uploadComplete ? 'completed' : ''}`}>
        {uploading ? 'Uploading...' : (uploadComplete ? 'Concluído' : (selected ? 'Upload' : 'Selecionar Imagem'))}
      </button>
    </div>
  );
}

export default CharacterImageUploader;
