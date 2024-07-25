import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDatabase, ref, get } from 'firebase/database';
import './PostArtDetails.css';
import PostInteractions from '../../components/PostInteractions/PostInteractions';
import CommentSection from '../../components/CommentSection/CommentSection';

function PostArtDetails() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const db = getDatabase();
        const postRef = ref(db, `posts/${id}`);

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
    }, [id]);

    const handleGoBack = () => {
        navigate(-1); // Volta à página anterior
    };

    if (loading) return <div>Carregando...</div>;
    if (error) return (
        <div>
            <p>{error}</p>
            <button onClick={handleGoBack}>Voltar</button>
        </div>
    );

    return (
        <div className="post-details">
            {post && (
                <>
                    <h1>{post.title}</h1>
                    {post.imageUrl && (
                        <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="post-image"
                        />
                    )}
                    <p className='description'>{post.description}</p>
                    {post.link && (
                        <a
                            href={post.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="post-link"
                        >
                            Site de Terceiros
                        </a>
                    )}
                    {post.createdAt && (
                        <p className="post-date">
                            Postado em: {new Date(post.createdAt).toLocaleString()}
                        </p>
                    )}
                    <p className="post-by">
                        Criado por: {userName}
                    </p>
                    <PostInteractions
                        postId={id}
                        initialLikes={post.likes || 0}
                        initialFavorites={post.favorites || 0}
                    />
                    <CommentSection postId={id} />
                    <button onClick={handleGoBack} className="back-button">Voltar</button>
                </>
            )}
        </div>
    );
}

export default PostArtDetails;
