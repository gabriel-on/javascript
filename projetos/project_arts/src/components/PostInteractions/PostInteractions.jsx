// src/components/PostInteractions.js
import React, { useState, useEffect } from 'react';
import { getDatabase, ref, set, update, get } from 'firebase/database';
import { useAuth } from '../../hooks/useAuthentication';

const PostInteractions = ({ postId, initialLikes, initialFavorites }) => {
  const [likes, setLikes] = useState(initialLikes || 0);
  const [favorites, setFavorites] = useState(initialFavorites || 0);
  const { currentUser } = useAuth();

  useEffect(() => {
    // Atualize o estado local com os valores iniciais passados como props
    setLikes(initialLikes);
    setFavorites(initialFavorites);
  }, [initialLikes, initialFavorites]);

  const handleLike = async () => {
    if (currentUser) {
      const db = getDatabase();
      const postRef = ref(db, `posts/${postId}`);

      // Obtém o valor atual de likes
      const snapshot = await get(postRef);
      let currentLikes = snapshot.val().likes || 0; // Usa 0 como valor padrão se likes não estiver definido

      // Incrementa o número de likes
      const newLikes = currentLikes + 1;

      // Atualize o número de likes no banco de dados
      await update(postRef, { likes: newLikes });

      // Atualize o estado local
      setLikes(newLikes);
    }
  };

  const handleFavorite = async () => {
    if (currentUser) {
      const db = getDatabase();
      const userFavoritesRef = ref(db, `users/${currentUser.uid}/favorites`);

      // Adiciona o post aos favoritos do usuário
      await set(userFavoritesRef.child(postId), true);

      // Obtém o valor atual de favoritos
      const postRef = ref(db, `posts/${postId}`);
      const snapshot = await get(postRef);
      const currentFavorites = snapshot.val().favorites || 0;

      // Incrementa o número de favoritos
      const newFavorites = currentFavorites + 1;

      // Atualize o número de favoritos no banco de dados
      await update(postRef, { favorites: newFavorites });

      // Atualize o estado local
      setFavorites(newFavorites);
    }
  };

  return (
    <div className="post-interactions">
      <button onClick={handleLike} className="like-button">
        👍 {likes}
      </button>
      <button onClick={handleFavorite} className="favorite-button">
        ⭐ {favorites}
      </button>
    </div>
  );
};

export default PostInteractions;
