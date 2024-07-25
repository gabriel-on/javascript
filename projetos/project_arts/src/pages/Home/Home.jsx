// src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import usePosts from '../../hooks/useArtPosts';
import PostInteractions from '../../components/PostInteractions/PostInteractions'; // Importa o novo componente
import './Home.css';

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
                        <div key={post.id} className="post-item">
                            <Link to={`/art/${post.id}`} className="post-link">
                                {post.imageUrl && (
                                    <img
                                        src={post.imageUrl}
                                        alt={post.title}
                                        className="post-image"
                                    />
                                )}
                                <div className="post-title">{post.title}</div>
                            </Link>
                            <PostInteractions
                                postId={post.id}
                                initialLikes={post.likes}
                                initialFavorites={post.favorites}
                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Home;
