import React from 'react';
import './SuccessModal.css';

const SuccessModal = ({ isOpen, onClose, message }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Sucesso</h2>
                <p>{message}</p>
                <div className="modal-actions">
                    <button onClick={onClose}>Fechar</button>
                </div>
            </div>
        </div>
    );
};

export default SuccessModal;
