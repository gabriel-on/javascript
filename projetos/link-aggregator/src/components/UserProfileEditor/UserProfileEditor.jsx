import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuthentication';
import { getDatabase, ref, get, update } from 'firebase/database';
import { getAuth, updateProfile } from 'firebase/auth';
import ProfilePictureUploader from '../../components/ProfilePictureUploader/ProfilePictureUploader';
import BannerUploader from '../../components/BannerUploader/BannerUploader';
import './UserProfileEditor.css';

const UserProfileEditor = () => {
    const { currentUser, updatePasswordUser } = useAuth();
    const [name, setName] = useState('');
    const [mention, setMention] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (currentUser) {
            setName(currentUser.displayName || '');
            setMention(currentUser.mentionName || '');
        }
    }, [currentUser]);

    const checkMentionAvailability = async (mention) => {
        const mentionNameRef = ref(getDatabase(), 'users');
        const snapshot = await get(mentionNameRef);
        if (snapshot.exists()) {
            const users = snapshot.val();
            for (const key in users) {
                if (users[key].mentionName === mention && key !== currentUser.uid) {
                    return false; // Menção já em uso
                }
            }
        }
        return true; // Menção disponível
    };

    const handleSave = async () => {
        setError('');
        setSuccessMessage('');
        setIsLoading(true);

        if (!mention) {
            setError('Por favor, preencha todos os campos obrigatórios.');
            setIsLoading(false);
            return;
        }

        const isMentionAvailable = await checkMentionAvailability(mention);
        if (!isMentionAvailable) {
            setError('A menção já está em uso. Escolha outra.');
            setIsLoading(false);
            return;
        }

        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (user) {
                // Atualiza o perfil no Firebase Auth
                await updateProfile(user, {
                    displayName: name,
                });

                // Atualiza o perfil no Realtime Database
                const db = getDatabase();
                const userRef = ref(db, `users/${user.uid}`);
                await update(userRef, {
                    displayName: name,
                    mentionName: mention,
                });

                setSuccessMessage('Informações salvas com sucesso!');
            } else {
                setError('Usuário não encontrado. Faça login novamente.');
            }
        } catch (error) {
            setError('Erro ao salvar as informações: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordChange = async () => {
        setError('');
        setSuccessMessage('');
        setIsLoading(true);

        if (newPassword.length < 6) {
            setError('A nova senha deve conter pelo menos 6 caracteres.');
            setIsLoading(false);
            return;
        }

        try {
            await updatePasswordUser(newPassword);
            setSuccessMessage('Senha atualizada com sucesso!');
            setNewPassword(''); // Limpar o campo de senha após sucesso
        } catch (error) {
            setError('Erro ao atualizar a senha: ' + error.message);
            setSuccessMessage('');
        } finally {
            setIsLoading(false);
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
                    E-mail:
                    <input
                        type="email"
                        value={currentUser ? currentUser.email : ''}
                        disabled
                        placeholder="Seu e-mail"
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
            <button onClick={handleSave} disabled={isLoading}>Salvar Informações</button>
            <button onClick={handlePasswordChange} disabled={isLoading}>Atualizar Senha</button>
        </div>
    );
};

export default UserProfileEditor;
