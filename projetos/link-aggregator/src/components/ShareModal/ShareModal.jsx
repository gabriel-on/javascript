// src/components/ShareModal/ShareModal.jsx
import React from 'react';
import QRCodeGenerator from '../QRCodeGenerator/QRCodeGenerator'; // Importe o QRCodeGenerator
import './ShareModal.css';

const ShareModal = ({ isOpen, onClose, link }) => {
    if (!isOpen) return null;

    const shareLink = async (platform) => {
        const encodedUrl = encodeURIComponent(link.url);
        const encodedTitle = encodeURIComponent(link.title);

        let shareUrl = '';

        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
                break;
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
                break;
            case 'email':
                shareUrl = `mailto:?subject=${encodedTitle}&body=${encodedUrl}`;
                break;
            default:
                return;
        }

        window.open(shareUrl, '_blank'); // Abre o link de compartilhamento em uma nova aba
        onClose(); // Fecha o modal
    };

    const copyLink = async () => {
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

                {/* Componente QRCodeGenerator para gerar o QR Code */}
                <QRCodeGenerator value={link.url} />

                <button onClick={copyLink}>Copiar Link</button> {/* Botão para copiar o link */}
                <div>
                    <h3>Compartilhar via:</h3>
                    <button onClick={() => shareLink('facebook')}>Facebook</button>
                    <button onClick={() => shareLink('twitter')}>Twitter</button>
                    <button onClick={() => shareLink('whatsapp')}>WhatsApp</button>
                    <button onClick={() => shareLink('email')}>E-mail</button>
                </div>
                <button onClick={onClose}>Fechar</button>
            </div>
        </div>
    );
};

export default ShareModal;
