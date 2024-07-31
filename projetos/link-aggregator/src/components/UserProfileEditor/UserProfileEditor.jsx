// src/components/UserProfileEditor/UserProfileEditor.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuthentication';
import { getDatabase, ref, update } from 'firebase/database';
import ProfilePictureUploader from '../../components/ProfilePictureUploader/ProfilePictureUploader';
import BannerUploader from '../../components/BannerUploader/BannerUploader';
import './UserProfileEditor.css';

const UserProfileEditor = () => {
    const { currentUser } = useAuth();
    const [name, setName] = useState('');
    const [mention, setMention] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (currentUser) {
            setName(currentUser.displayName || '');
            setMention(currentUser.mentionName || '');
            setEmail(currentUser.email || '');
        }
    }, [currentUser]);

    const handleSave = async () => {
        if (!name || !mention || !email) {
            setError('Por favor, preencha todos os campos.');
            return;
        }

        // Validação básica para o e-mail
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setError('Por favor, insira um e-mail válido.');
            return;
        }

        const updates = {};
        if (currentUser) {
            updates[`/users/${currentUser.uid}/displayName`] = name;
            updates[`/users/${currentUser.uid}/mentionName`] = mention;
            updates[`/users/${currentUser.uid}/email`] = email;

            const database = getDatabase();
            await update(ref(database), updates);
            setSuccessMessage('Informações atualizadas com sucesso!');
            setError('');
        }
    };

    return (
        <div className="user-profile-editor">
            <h2>Editar Perfil</h2>
            {error && <p className="error">{error}</p>}
            {successMessage && <p className="success">{successMessage}</p>}
            <ProfilePictureUploader />
            <BannerUploader />
            <div>
                <label>
                    Nome:
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Seu nome"
                    />
                </label>
                <label>
                    Menção/Apelido:
                    <input
                        type="text"
                        value={mention}
                        onChange={(e) => setMention(e.target.value)} // Corrigido aqui
                        placeholder="menção/apelido"
                    />
                </label>
            </div>
            <div>
                <label>
                    E-mail:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Seu e-mail"
                    />
                </label>
            </div>
            <button onClick={handleSave}>Salvar</button>
        </div>
    );
};

export default UserProfileEditor;
