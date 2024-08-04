import React, { useState, useEffect, useRef } from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, link, onEdit, onDelete }) => {
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const modalRef = useRef(); // Referência para o modal

    useEffect(() => {
        if (link) {
            setTitle(link.title);
            setUrl(link.url);
        } else {
            setTitle('');
            setUrl('');
        }
    }, [link]);

    const handleEdit = () => {
        if (link) {
            onEdit(link.id, title, url);
            onClose();
        }
    };

    const handleDelete = () => {
        if (link) {
            onDelete(link.id);
            onClose();
        }
    };

    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            onClose(); // Fecha o modal se clicar fora
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content" ref={modalRef}>
                <h2>Editar Link</h2>
                <div className='inputs-content'>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Title"
                    />
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="URL"
                    />
                </div>
                <div className="modal-buttons">
                    <button onClick={handleEdit}>Salvar</button>
                    <button onClick={handleDelete}>Deletar</button>
                    <button onClick={onClose}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
