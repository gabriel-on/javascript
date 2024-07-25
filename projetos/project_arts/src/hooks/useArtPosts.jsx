// src/hooks/usePosts.js
import { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';

const useArtPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const db = getDatabase();
    const postsRef = ref(db, 'posts/');

    const unsubscribe = onValue(postsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedPosts = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setPosts(formattedPosts);
      } else {
        setPosts([]);
      }
      setLoading(false);
    }, (error) => {
      setError(error);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return { posts, loading, error };
};

export default useArtPosts;
