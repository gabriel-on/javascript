import React from 'react';
import './ImageModal.css';

const ImageModal = ({ isOpen, onClose, imageSrc, onDownload }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>✖</button>
                <img src={imageSrc} alt="Imagem em tela cheia" className="modal-image" />
                <button className="download-button" onClick={onDownload}>
                    Baixar Imagem
                </button>
            </div>
        </div>
    );
};

export default ImageModal;
