import React, { useEffect, useState } from 'react';
import { getAuth, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const EmailVerification = () => {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const auth = getAuth();
    const emailForSignIn = window.localStorage.getItem('emailForSignIn');

    useEffect(() => {
        const verifyEmail = async () => {
            if (isSignInWithEmailLink(auth, window.location.href)) {
                if (!emailForSignIn) {
                    setMessage('Nenhum e-mail encontrado para verificação.');
                    setLoading(false);
                    return;
                }

                try {
                    // Autentica o usuário com o link
                    const userCredential = await signInWithEmailLink(auth, emailForSignIn, window.location.href);
                    const user = userCredential.user;

                    // Verifica se o e-mail foi verificado
                    if (user.emailVerified) {
                        setMessage('Seu e-mail já foi verificado.');
                    } else {
                        setMessage('Seu e-mail foi verificado com sucesso!');
                        // Aqui você pode atualizar o estado do usuário ou realizar outras ações
                    }

                    // Redirecionar após a verificação
                    navigate('/'); // Redireciona para a página desejada
                } catch (error) {
                    setMessage(`Erro ao verificar o e-mail: ${error.message}`);
                } finally {
                    setLoading(false);
                }
            } else {
                setMessage('Link de verificação inválido.');
                setLoading(false);
            }
        };

        verifyEmail();
    }, [auth, emailForSignIn, navigate]);

    return (
        <div>
            <h2>Verificação de E-mail</h2>
            {loading ? <p>Verificando...</p> : <p>{message}</p>}
        </div>
    );
};

export default EmailVerification;
