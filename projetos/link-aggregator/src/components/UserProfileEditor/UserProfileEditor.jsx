// src/components/UserProfileEditor/UserProfileEditor.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuthentication';
import { getDatabase, ref, update, get } from 'firebase/database';
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
        if (!mention || !email) {
            setError('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        // Validação básica para o e-mail
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setError('Por favor, insira um e-mail válido.');
            return;
        }

        // Verificação se a menção já está em uso
        const mentionNameRef = ref(getDatabase(), 'users');
        const snapshot = await get(mentionNameRef);
        let mentionNameExists = false;

        if (snapshot.exists()) {
            const users = snapshot.val();
            for (const key in users) {
                // Verifica se a nova menção já está em uso por outro usuário,
                // mas ignora o usuário atual
                if (users[key].mentionName === mention && key !== currentUser.uid) {
                    mentionNameExists = true;
                    break;
                }
            }
        }

        // Se a menção já estiver em uso por outro usuário, mostra erro
        if (mentionNameExists) {
            setError('A menção já está em uso. Escolha outra.'); // Define a mensagem de erro
            setSuccessMessage(''); // Limpa a mensagem de sucesso
            return;
        }

        const updates = {};
        if (currentUser) {
            updates[`/users/${currentUser.uid}/displayName`] = name; // O nome pode ser salvo mesmo sem alteração
            updates[`/users/${currentUser.uid}/mentionName`] = mention;
            updates[`/users/${currentUser.uid}/email`] = email;

            const database = getDatabase();
            await update(ref(database), updates);
            setSuccessMessage('Informações atualizadas com sucesso!'); // Define a mensagem de sucesso
            setError(''); // Limpa a mensagem de erro
        }
    };

    return (
        <div className="user-profile-editor">
            <h2>Editar Perfil</h2>
            {successMessage && <p className="success">{successMessage}</p>}
            <ProfilePictureUploader />
            <BannerUploader />
            <div>
                <label>
                    Nome (opcional):
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Seu nome"
                    />
                </label>
                {error && <p className="error">{error}</p>}
                <label>
                    Menção/Apelido (obrigatório):
                    <input
                        type="text"
                        value={mention}
                        onChange={(e) => setMention(e.target.value)}
                        placeholder="menção/apelido"
                        required
                    />
                </label>
            </div>
            <div>
                <label>
                    E-mail (obrigatório):
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Seu e-mail"
                        required
                    />
                </label>
            </div>
            <button onClick={handleSave}>Salvar</button>
        </div>
    );
};

export default UserProfileEditor;
