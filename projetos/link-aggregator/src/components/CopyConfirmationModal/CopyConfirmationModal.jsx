import React, { useEffect, useState } from 'react';
import './CopyConfirmationModal.css';

const CopyConfirmationModal = ({ isOpen, onClose, autoCloseTime = 2000 }) => {
    const [countdown, setCountdown] = useState(autoCloseTime / 1000);

    useEffect(() => {
        if (isOpen) {
            setCountdown(autoCloseTime / 1000); // Resetar a contagem quando o modal é aberto
            const timer = setTimeout(onClose, autoCloseTime);
            const countdownInterval = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
            return () => {
                clearTimeout(timer);
                clearInterval(countdownInterval);
            };
        }
    }, [isOpen, onClose, autoCloseTime]);

    if (!isOpen) return null;

    return (
        <div className="copy-modal-overlay">
            <div className="copy-modal-content">
                <h2>Link Copiado!</h2>
                <p>O link do perfil foi copiado para a área de transferência.</p>
                <p>Fechando em {countdown} segundos...</p>
                <button onClick={onClose}>Fechar</button>
            </div>
        </div>
    );
};

export default CopyConfirmationModal;
