// src/components/ProfilePictureUploader/ProfilePictureUploader.jsx
import React, { useState, useEffect } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { useAuth } from '../../hooks/useAuthentication';
import { getDatabase, ref as dbRef, update, get } from 'firebase/database';

const ProfilePictureUploader = () => {
  const { currentUser } = useAuth();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [currentImage, setCurrentImage] = useState('');

  useEffect(() => {
    // Certifique-se de que currentUser não é null
    if (currentUser) {
      const fetchProfileImage = async () => {
        const db = getDatabase();
        const userRef = dbRef(db, `users/${currentUser.uid}/profileImage`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          setCurrentImage(snapshot.val());
        }
      };
      
      fetchProfileImage();
    }
  }, [currentUser]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    const storage = getStorage();
    const storageRef = ref(storage, `profile_pictures/${currentUser.uid}/${file.name}`);
    
    setUploading(true);
    setError(null);

    try {
      // Se houver uma imagem anterior, exclua-a
      if (currentImage) {
        const oldImageRef = ref(storage, currentImage);
        await deleteObject(oldImageRef);
      }

      // Fazer upload do novo arquivo
      await uploadBytes(storageRef, file);
      // Obter a URL do novo arquivo
      const url = await getDownloadURL(storageRef);

      // Atualizar a URL da imagem no Realtime Database
      const db = getDatabase();
      const userRef = dbRef(db, `users/${currentUser.uid}`);
      await update(userRef, { profileImage: url });
      
      // Atualizar a imagem atual
      setCurrentImage(url);
    } catch (err) {
      console.error('Erro ao fazer upload da imagem:', err);
      setError('Falha ao fazer upload da imagem.');
    } finally {
      setUploading(false);
    }
  };

  if (!currentUser) {
    return null; // Ou um loading spinner
  }

  return (
    <div>
      <h2>Upload Profile Picture</h2>
      {currentImage && (
        <div>
          <img src={currentImage} alt="Profile" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
          <p>Current Profile Picture</p>
        </div>
      )}
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ProfilePictureUploader;
