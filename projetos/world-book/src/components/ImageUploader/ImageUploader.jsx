import React, { useState } from 'react';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getDatabase, ref as dbRef, update } from 'firebase/database';

const ImageUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      console.log('Nenhuma imagem selecionada.');
      return;
    }

    setUploading(true);
    const storage = getStorage(); // Obtenha uma referência ao Firebase Storage
    const storageRef = storageRef(storage, 'images/' + selectedFile.name); // Crie uma referência para o arquivo

    try {
      // Faça o upload do arquivo
      const snapshot = await uploadBytes(storageRef, selectedFile);

      // Obtenha a URL de download do arquivo
      const downloadURL = await getDownloadURL(snapshot.ref);

      console.log('URL da imagem:', downloadURL);
      setImageUrl(downloadURL);
      setUploading(false);
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>Enviar</button>
      {uploading && <div>Progresso do Upload: {uploadProgress}%</div>}
      {imageUrl && <img src={imageUrl} alt="Uploaded" style={{ width: '300px', height: 'auto' }} />}
    </div>
  );
};

export default ImageUploader;
