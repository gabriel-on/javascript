import { useState, useEffect } from 'react';
import { getDatabase, ref, get, update } from 'firebase/database';
import { getAuth, updateProfile, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';

const useUserProfile = (currentUser) => {
    const [name, setName] = useState('');
    const [mention, setMention] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [bio, setBio] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (currentUser) {
            const db = getDatabase();
            const userRef = ref(db, `users/${currentUser.uid}`);
            get(userRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    setName(userData.displayName || '');
                    setMention(userData.mentionName || '');
                    setBio(userData.bio || '');
                }
            });
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

    const handleSubmit = async () => {
        setError('');
        setSuccessMessage('');
        setIsLoading(true);

        if (!currentPassword) {
            setError('Por favor, insira sua senha atual para salvar as informações.');
            setIsLoading(false);
            return;
        }

        const auth = getAuth();
        const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);

        try {
            await reauthenticateWithCredential(auth.currentUser, credential);
        } catch (error) {
            setError('Senha atual incorreta. Tente novamente.');
            setIsLoading(false);
            return;
        }

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
            const user = auth.currentUser;

            await updateProfile(user, {
                displayName: name,
            });

            const db = getDatabase();
            const userRef = ref(db, `users/${user.uid}`);
            await update(userRef, {
                displayName: name,
                mentionName: mention,
                bio: bio,
            });

            if (newPassword) {
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

                await updatePassword(user, newPassword);
            }

            setSuccessMessage('Informações salvas com sucesso!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            setError('Erro ao salvar as informações: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        name,
        setName,
        mention,
        setMention,
        currentPassword,
        setCurrentPassword,
        newPassword,
        setNewPassword,
        bio,
        setBio,
        confirmPassword,
        setConfirmPassword,
        error,
        successMessage,
        isLoading,
        handleSubmit,
    };
};

export default useUserProfile;
