import { useEffect, useState } from 'react';
import { getDatabase, ref, get } from 'firebase/database';

const usePostDetails = (postId) => {
    const [post, setPost] = useState(null);
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const db = getDatabase();
        const postRef = ref(db, `posts/${postId}`);

        // Fetch the post data
        get(postRef).then((snapshot) => {
            if (snapshot.exists()) {
                const postData = snapshot.val();
                setPost(postData);
                // Fetch the user's display name if userId is available
                if (postData.userId) {
                    const userRef = ref(db, `users/${postData.userId}`);
                    get(userRef).then((userSnapshot) => {
                        if (userSnapshot.exists()) {
                            const userData = userSnapshot.val();
                            setUserName(userData.displayName || 'Usuário');
                        }
                    }).catch((error) => {
                        console.error('Erro ao carregar dados do usuário', error);
                    });
                }
            } else {
                setError('Post não encontrado');
            }
            setLoading(false);
        }).catch((error) => {
            setError('Erro ao carregar post');
            setLoading(false);
        });
    }, [postId]);

    return { post, userName, loading, error };
};

export default usePostDetails;
