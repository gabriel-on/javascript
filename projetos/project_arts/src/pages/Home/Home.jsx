// src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom'; // Importa o Link para navegação
import usePosts from '../../hooks/useArtPosts';
import './Home.css'; // Importa o CSS para o layout

function Home() {
    const { posts, loading, error } = usePosts();

    if (loading) return <div>Carregando...</div>;
    if (error) return <div>Erro ao carregar posts: {error.message}</div>;

    return (
        <div>
            <h1>Posts</h1>
            <div className="posts-container">
                {posts.length === 0 ? (
                    <p>Nenhum post encontrado.</p>
                ) : (
                    posts.map(post => (
                        <Link
                            key={post.id}
                            to={`/art/${post.id}`}
                            className="post-item" // Usando Link como um wrapper
                        >
                            {post.imageUrl && (
                                <img
                                    src={post.imageUrl}
                                    alt={post.title}
                                    className="post-image"
                                />
                            )}
                            <div className="post-title">{post.title}</div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}

export default Home;
