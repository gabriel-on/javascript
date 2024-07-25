// src/components/PostInteractions.js
import React, { useState, useEffect } from 'react';
import { getDatabase, ref, set, update, remove, get } from 'firebase/database';
import { useAuth } from '../../hooks/useAuthentication';

const PostInteractions = ({ postId, initialLikes, initialFavorites }) => {
  const [likes, setLikes] = useState(initialLikes || 0);
  const [favorites, setFavorites] = useState(initialFavorites || 0);
  const [userLiked, setUserLiked] = useState(false);
  const [userFavorited, setUserFavorited] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchUserInteractions = async () => {
      if (currentUser) {
        const db = getDatabase();
        const userLikesRef = ref(db, `users/${currentUser.uid}/likes/${postId}`);
        const userFavoritesRef = ref(db, `users/${currentUser.uid}/favorites/${postId}`);
        
        // Verifica se o usuário já curtiu o post
        const userLikesSnapshot = await get(userLikesRef);
        setUserLiked(userLikesSnapshot.exists());
        
        // Verifica se o usuário já favoritou o post
        const userFavoritesSnapshot = await get(userFavoritesRef);
        setUserFavorited(userFavoritesSnapshot.exists());
      }
    };

    fetchUserInteractions();
  }, [currentUser, postId]);

  const handleLike = async () => {
    if (currentUser) {
      const db = getDatabase();
      const postRef = ref(db, `posts/${postId}`);
      const userLikesRef = ref(db, `users/${currentUser.uid}/likes/${postId}`);
      
      if (userLiked) {
        // Remove o like do post e do usuário
        await update(postRef, { likes: likes - 1 });
        await remove(userLikesRef);
        setUserLiked(false);
        setLikes(likes - 1);
      } else {
        // Adiciona o like ao post e ao usuário
        await update(postRef, { likes: likes + 1 });
        await set(userLikesRef, true);
        setUserLiked(true);
        setLikes(likes + 1);
      }
    }
  };

  const handleFavorite = async () => {
    if (currentUser) {
      const db = getDatabase();
      const postRef = ref(db, `posts/${postId}`);
      const userFavoritesRef = ref(db, `users/${currentUser.uid}/favorites/${postId}`);
      
      if (userFavorited) {
        // Remove o favorito do post e do usuário
        await update(postRef, { favorites: favorites - 1 });
        await remove(userFavoritesRef);
        setUserFavorited(false);
        setFavorites(favorites - 1);
      } else {
        // Adiciona o favorito ao post e ao usuário
        await update(postRef, { favorites: favorites + 1 });
        await set(userFavoritesRef, true);
        setUserFavorited(true);
        setFavorites(favorites + 1);
      }
    }
  };

  return (
    <div className="post-interactions">
      <button onClick={handleLike} className="like-button">
        {userLiked ? '👎' : '👍'} {likes}
      </button>
      <button onClick={handleFavorite} className="favorite-button">
        {userFavorited ? '⭐' : '☆'} {favorites}
      </button>
    </div>
  );
};

export default PostInteractions;
