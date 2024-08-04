import React, { useRef, useState, useEffect } from 'react';
import QRCodeGenerator from '../QRCodeGenerator/QRCodeGenerator';
import './ShareModal.css';
import CopyConfirmationModal from '../CopyConfirmationModal/CopyConfirmationModal';

const ShareModal = ({ isOpen, onClose, link }) => {
    const modalRef = useRef(); // Referência para o conteúdo do modal
    const [isCopyModalOpen, setCopyModalOpen] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose(); // Fecha o modal se clicar fora
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

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
            setCopyModalOpen(true); // Abre o modal de confirmação de cópia
        } catch (error) {
            console.error('Erro ao copiar o link:', error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" ref={modalRef}>
                <h2>Compartilhar Link</h2>
                <p>{link.title}</p>

                {/* Componente QRCodeGenerator para gerar o QR Code */}
                <QRCodeGenerator value={link.url} />

                <div className='social-container'>
                    <h3>Compartilhar via:</h3>
                    <button onClick={() => shareLink('facebook')} className='facebook'>Facebook</button>
                    <button onClick={() => shareLink('twitter')} className='twitter'>X (Twitter)</button>
                    <button onClick={() => shareLink('whatsapp')} className='whatsapp'>WhatsApp</button>
                    <button onClick={() => shareLink('email')} className='email'>E-mail</button>
                </div>
                <button onClick={copyLink}>Copiar Link</button>
                <button onClick={onClose}>Fechar</button>
            </div>

            <CopyConfirmationModal
                isOpen={isCopyModalOpen}
                onClose={() => setCopyModalOpen(false)}
                autoCloseTime={2000}
            />
        </div>
    );
};

export default ShareModal;
