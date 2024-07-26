import React, { useState } from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, commentData, onUpdate, onDelete, currentUser }) => {
    const [editedContent, setEditedContent] = useState(commentData.content);

    const handleUpdate = () => {
        if (editedContent.trim() === '') {
            alert("O conteúdo do comentário não pode estar vazio!");
            return;
        }
        onUpdate(commentData.id, editedContent);
        onClose();
    };

    const handleDelete = () => {
        if (window.confirm("Você tem certeza que deseja excluir este comentário?")) {
            onDelete(commentData.id);
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Editar Comentário</h2>
                <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    placeholder="Editar comentário..."
                />
                <div className="modal-buttons">
                    <button onClick={handleUpdate}>Salvar</button>
                    <button onClick={handleDelete} style={{ backgroundColor: 'red' }}>
                        Excluir
                    </button>
                    <button onClick={onClose}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
