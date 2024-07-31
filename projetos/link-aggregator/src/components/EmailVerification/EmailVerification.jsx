import React, { useEffect, useState } from 'react';
import { getAuth, isSignInWithEmailLink, signInWithEmailLink, updateEmail } from 'firebase/auth';
import { getDatabase, ref, update } from 'firebase/database';
import { useNavigate } from 'react-router-dom';

const EmailVerification = () => {
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const auth = getAuth();
    const emailForSignIn = window.localStorage.getItem('emailForSignIn');

    useEffect(() => {
        if (isSignInWithEmailLink(auth, window.location.href)) {
            if (!emailForSignIn) {
                setMessage('Nenhum e-mail encontrado para verificação.');
                return;
            }

            signInWithEmailLink(auth, emailForSignIn, window.location.href)
                .then(async (result) => {
                    // Update email in Firebase Auth
                    await updateEmail(auth.currentUser, emailForSignIn);

                    // Update email in Realtime Database
                    const userRef = ref(getDatabase(), `users/${auth.currentUser.uid}`);
                    await update(userRef, {
                        email: emailForSignIn
                    });

                    window.localStorage.removeItem('emailForSignIn');
                    setMessage('Seu e-mail foi verificado e atualizado com sucesso!');
                    navigate('/'); // Redirect to profile or any other page
                })
                .catch((error) => {
                    setMessage(`Erro ao verificar o e-mail: ${error.message}`);
                });
        } else {
            setMessage('Link de verificação inválido.');
        }
    }, [auth, emailForSignIn, navigate]);

    return (
        <div>
            <h2>Verificação de E-mail</h2>
            <p>{message}</p>
        </div>
    );
};

export default EmailVerification;
