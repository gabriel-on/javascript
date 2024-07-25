// src/components/PostFormArt.js
import React, { useState } from 'react';
import { ref as dbRef, set } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { database, storage } from '../../firebase/config';
import { useAuth } from '../../hooks/useAuthentication';

const PostFormArt = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth(); // Obtém o usuário autenticado

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (image && currentUser) {
      const imageRef = storageRef(storage, `images/${image.name}`);
      await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(imageRef);

      const postId = Date.now().toString();
      set(dbRef(database, 'posts/' + postId), {
        userId: currentUser.uid, // Adiciona o ID do usuário
        title,
        description,
        link,
        imageUrl
      });

      setTitle('');
      setDescription('');
      setLink('');
      setImage(null);
      setLoading(false);
    } else {
      setLoading(false);
      // Handle the case where image or currentUser is not available
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Título:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <label>Descrição:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
      </div>
      <div>
        <label>Link:</label>
        <input type="url" value={link} onChange={(e) => setLink(e.target.value)} />
      </div>
      <div>
        <label>Imagem:</label>
        <input type="file" onChange={handleImageChange} required />
      </div>
      <button type="submit" disabled={loading}>Postar</button>
    </form>
  );
};

export default PostFormArt;