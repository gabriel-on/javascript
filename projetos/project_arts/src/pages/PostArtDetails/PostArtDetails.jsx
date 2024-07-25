import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDatabase, ref, get } from 'firebase/database';
import './PostArtDetails.css';
import PostInteractions from '../../components/PostInteractions/PostInteractions';

function PostArtDetails() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const db = getDatabase();
        const postRef = ref(db, `posts/${id}`);

        get(postRef).then((snapshot) => {
            if (snapshot.exists()) {
                setPost(snapshot.val());
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
                            Leia mais
                        </a>
                    )}
                    {post.createdAt && (
                        <p className="post-date">
                            Postado em: {new Date(post.createdAt).toLocaleString()}
                        </p>
                    )}
                    <p className="post-by">
                        Criado Por:
                    </p>
                    <PostInteractions
                        postId={id}
                        initialLikes={post.likes || 0}
                        initialFavorites={post.favorites || 0}
                    />
                    <button onClick={handleGoBack} className="back-button">Voltar</button>
                </>
            )}
        </div>
    );
}

export default PostArtDetails;
