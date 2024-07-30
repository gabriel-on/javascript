// src/components/ShareModal/ShareModal.jsx
import React from 'react';
import './ShareModal.css';

const ShareModal = ({ isOpen, onClose, link }) => {
    if (!isOpen) return null;

    const shareLink = async () => {
        try {
            await navigator.clipboard.writeText(link.url); // Copia o link para a área de transferência
            alert(`Link copiado: ${link.url}`); // Mensagem de confirmação
        } catch (error) {
            console.error('Erro ao copiar o link:', error);
        } finally {
            onClose(); // Fecha o modal após a cópia
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Compartilhar Link</h2>
                <p>{link.title}</p>
                <button onClick={shareLink}>Copiar Link</button> {/* Botão para copiar o link */}
                <button onClick={onClose}>Fechar</button>
            </div>
        </div>
    );
};

export default ShareModal;
