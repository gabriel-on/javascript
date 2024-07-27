import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { saveAs } from 'file-saver';
import './PostArtDetails.css';
import PostInteractions from '../../components/PostInteractions/PostInteractions';
import CommentSection from '../../components/CommentSection/CommentSection';
import ImageSlider from '../../components/ImageSlider/ImageSlider';
import ImageModal from '../../components/ImageModal/ImageModal';
import usePostDetails from '../../hooks/usePostDetails';

function PostArtDetails() {
    const { id } = useParams();
    const { post, userName, loading, error } = usePostDetails(id);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState('');
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1); // Volta à página anterior
    };

    const handleDownloadImage = () => {
        if (post && post.imageUrl) {
            saveAs(post.imageUrl, `${post.title}.jpg`); // Nome do arquivo baixado
        }
    };

    const openModal = (image) => {
        setCurrentImage(image);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
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
            <div>
                <button onClick={handleGoBack} className="back-button">Voltar</button>
            </div>
            {post && (
                <div>
                    <div>
                        {post.imageUrls && post.imageUrls.length > 1 ? (
                            <ImageSlider images={post.imageUrls} onImageClick={openModal} />
                        ) : (
                            post.imageUrl && (
                                <img
                                    src={post.imageUrl}
                                    alt={post.title}
                                    className="post-image"
                                    onClick={() => openModal(post.imageUrl)} // Abrir modal na única imagem
                                />
                            )
                        )}
                    </div>
                    <div className='interactions'>
                        <PostInteractions
                            postId={id}
                            initialLikes={post.likes || 0}
                            initialFavorites={post.favorites || 0}
                        />
                    </div>
                    <div className='vertical-scroll'>
                        <h1>{post.title}</h1>
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
                        {post.allowDownload && post.imageUrl && (
                            <button onClick={handleDownloadImage} className="download-button">
                                Baixar Imagem
                            </button>
                        )}
                        <CommentSection postId={id} />
                    </div>
                </div>
            )}
            <ImageModal isOpen={isModalOpen} onClose={closeModal} imageSrc={currentImage} />
        </div>
    );
}

export default PostArtDetails;
