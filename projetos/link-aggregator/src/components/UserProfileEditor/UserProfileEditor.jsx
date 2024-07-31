import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuthentication';
import { getDatabase, ref, update, get } from 'firebase/database';
import { getAuth, fetchSignInMethodsForEmail } from 'firebase/auth';
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
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (currentUser) {
            setName(currentUser.displayName || '');
            setMention(currentUser.mentionName || '');
            setEmail(currentUser.email || '');
        }
    }, [currentUser]);

    const validateEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

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

        if (!mention || !email) {
            setError('Por favor, preencha todos os campos obrigatórios.');
            setIsLoading(false);
            return;
        }

        if (!validateEmail(email)) {
            setError('Por favor, insira um e-mail válido.');
            setIsLoading(false);
            return;
        }

        const isMentionAvailable = await checkMentionAvailability(mention);
        if (!isMentionAvailable) {
            setError('A menção já está em uso. Escolha outra.');
            setIsLoading(false);
            return;
        }

        const auth = getAuth();
        const updatedUser = auth.currentUser;

        if (updatedUser) {
            console.log('E-mail verificado:', updatedUser.emailVerified);

            if (updatedUser.emailVerified) {
                const signInMethods = await fetchSignInMethodsForEmail(auth, email);
                if (signInMethods.length > 0) {
                    setError('Este e-mail já está associado a outra conta.');
                    setIsLoading(false);
                    return;
                }

                try {
                    await updateEmailUser(email); // Atualiza o e-mail no Auth
                    await update(ref(getDatabase()), {
                        [`users/${currentUser.uid}/email`]: email,
                        [`users/${currentUser.uid}/mentionName`]: mention,
                        [`users/${currentUser.uid}/displayName`]: name,
                    }); // Atualiza o e-mail e menção no Realtime Database
                    setSuccessMessage('Informações atualizadas com sucesso!');
                    setError('');
                    // Limpar os campos após sucesso
                    setName('');
                    setMention('');
                    setEmail('');
                } catch (error) {
                    setError('Erro ao atualizar e-mail: ' + error.message);
                }
            } else {
                setError('Você precisa verificar seu e-mail antes de poder atualizá-lo.');
            }
        } else {
            setError('Usuário não encontrado. Faça login novamente.');
        }

        setIsLoading(false);
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
            <button onClick={handleSave} disabled={isLoading}>Salvar Informações</button>
            <button onClick={handlePasswordChange} disabled={isLoading}>Atualizar Senha</button>
        </div>
    );
};

export default UserProfileEditor;
