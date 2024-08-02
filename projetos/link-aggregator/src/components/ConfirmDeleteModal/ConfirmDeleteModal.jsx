import React, { useState } from 'react';
import './ConfirmDeleteModal.css';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm }) => {
    const [modalPassword, setModalPassword] = useState('');

    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm(modalPassword);
        setModalPassword(''); // Limpa a senha após a confirmação
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Deseja deletar sua conta?</h2>
                <p>Insira sua senha atual para confirmar. Uma vez confirmada, a ação não pode ser desfeita!</p>
                <input
                    type="password"
                    value={modalPassword}
                    onChange={(e) => setModalPassword(e.target.value)}
                    placeholder="Senha atual"
                    required
                />
                <div className="modal-actions">
                    <button onClick={handleConfirm}>
                        Confirmar
                    </button>
                    <button onClick={onClose}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;