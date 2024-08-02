import React, { useState } from 'react';
import './ConfirmDeleteModal.css';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm }) => {
    const [modalPassword, setModalPassword] = useState('');
    const [modalError, setModalError] = useState('');

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (modalPassword.trim() === '') {
            setModalError('A senha é obrigatória.');
            return;
        }
        onConfirm(modalPassword, setModalError);
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
                {modalError && <p className="error">{modalError}</p>}
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