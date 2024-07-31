import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuthentication';
import { getDatabase, ref, update, get } from 'firebase/database';
import { getAuth } from 'firebase/auth'; // Importe getAuth
import ProfilePictureUploader from '../../components/ProfilePictureUploader/ProfilePictureUploader';
import BannerUploader from '../../components/BannerUploader/BannerUploader';
import './UserProfileEditor.css';

const UserProfileEditor = () => {
    const { currentUser, updateEmailUser, updatePasswordUser } = useAuth();
    const [name, setName] = useState('');
    const [mention, setMention] = useState('');
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
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

        // ... (código de verificação de menção)

        const updates = {};
        if (currentUser) {
            updates[`/users/${currentUser.uid}/displayName`] = name; // O nome pode ser salvo mesmo sem alteração
            updates[`/users/${currentUser.uid}/mentionName`] = mention;

            const database = getDatabase();
            await update(ref(database), updates);
            setSuccessMessage('Informações atualizadas com sucesso!');
            setError('');

            // Verifique se o e-mail atual está verificado antes de permitir a atualização
            if (currentUser.emailVerified) {
                await updateEmailUser(email); // Altere esta linha para chamar a função correta
            } else {
                setError('Você precisa verificar seu e-mail antes de poder atualizá-lo.');
                return; // Retorna para não tentar atualizar o e-mail
            }
        }
    };

    const handlePasswordChange = async () => {
        if (newPassword.length < 6) {
            setError('A nova senha deve conter pelo menos 6 caracteres.');
            return;
        }

        try {
            await updatePasswordUser(newPassword); // Chama a função do hook
            setSuccessMessage('Senha atualizada com sucesso!');
            setError('');
            setNewPassword(''); // Limpa o campo de senha
        } catch (error) {
            setError('Erro ao atualizar a senha: ' + error.message);
            setSuccessMessage('');
        }
    };

    return (
        <div className="user-profile-editor">
            <h2>Editar Perfil</h2>
            {successMessage && <p className="success">{successMessage}</p>}
            {error && <p className="error">{error}</p>}
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
            <div>
                <label>
                    Nova Senha:
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Digite a nova senha"
                    />
                </label>
            </div>
            <button onClick={handleSave}>Salvar Informações</button>
            <button onClick={handlePasswordChange}>Atualizar Senha</button>
        </div>
    );
};

export default UserProfileEditor;
