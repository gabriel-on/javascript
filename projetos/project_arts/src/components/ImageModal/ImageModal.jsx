import React from 'react';
import './ImageModal.css';

const ImageModal = ({ isOpen, onClose, imageSrc }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>✖</button>
                <img src={imageSrc} alt="Imagem em tela cheia" className="modal-image" />
            </div>
        </div>
    );
};

export default ImageModal;
