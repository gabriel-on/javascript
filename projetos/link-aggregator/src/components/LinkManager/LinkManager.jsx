import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Modal from '../Modal/Modal';
import './LinkManager.css';

const LinkManager = ({ links, addLink, editLink, deleteLink, emailVerified }) => {
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [selectedLink, setSelectedLink] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);

    const handleAddLink = () => {
        if (title && url) {
            addLink(title, url);
            setTitle('');
            setUrl('');
        }
    };

    const handleEditLink = (id, newTitle, newUrl) => {
        editLink(id, newTitle, newUrl);
    };

    const handleDeleteLink = (id) => {
        deleteLink(id);
    };

    const openModal = (link) => {
        setSelectedLink(link);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedLink(null);
    };

    return (
        <div className='link-container'>
            <div className='add-links'>
                <h2>Adicionar um novo link</h2>
                <div>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Título"
                        disabled={!emailVerified}
                    />
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="URL"
                        disabled={!emailVerified}
                    />
                </div>
                <button onClick={handleAddLink} disabled={!emailVerified || !title || !url}>
                    Adicionar Link
                </button>
            </div>
            {!emailVerified && (
                <p style={{ color: 'red' }}>⚠️ Verifique seu e-mail para poder adicionar novos links.</p>
            )}
            <div className='links-list'>
                <h2>Seus links</h2>
                <ul>
                    {links.map(link => (
                        <li key={link.id}>
                            <a href={link.url} target="_blank" rel="noopener noreferrer"><i className="bi bi-box-arrow-up-right"></i>{link.title}</a>
                            <button onClick={() => openModal(link)}>Editar</button>
                            <span>Adicionado em: {new Date(link.createdAt * 1000).toLocaleString()}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                link={selectedLink}
                onEdit={handleEditLink}
                onDelete={handleDeleteLink}
            />
        </div>
    );
};

export default LinkManager;
