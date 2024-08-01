import { useState, useEffect } from 'react';
import { getDatabase, ref, get, update } from 'firebase/database';
import { getAuth, updateProfile } from 'firebase/auth';

const useUserProfile = (currentUser) => {
    const [name, setName] = useState('');
    const [mention, setMention] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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

    const handlePasswordChange = async (updatePasswordUser) => {
        setError('');
        setSuccessMessage('');
        setIsLoading(true);

        if (newPassword.length < 6) {
            setError('A nova senha deve conter pelo menos 6 caracteres.');
            setIsLoading(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('As senhas não coincidem.');
            setIsLoading(false);
            return;
        }

        try {
            await updatePasswordUser(newPassword);
            setSuccessMessage('Senha atualizada com sucesso!');
            setNewPassword(''); // Limpar o campo de senha após sucesso
            setConfirmPassword(''); // Limpar o campo de confirmação de senha
        } catch (error) {
            setError('Erro ao atualizar a senha: ' + error.message);
            setSuccessMessage('');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        name,
        setName,
        mention,
        setMention,
        newPassword,
        setNewPassword,
        confirmPassword,
        setConfirmPassword,
        error,
        successMessage,
        isLoading,
        handleSave,
        handlePasswordChange,
    };
};

export default useUserProfile;