import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuthentication';
import { getAuth, applyActionCode, sendEmailVerification } from "firebase/auth";

const EmailVerification = () => {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser } = useAuth();

    useEffect(() => {
        const verifyEmail = async () => {
            const searchParams = new URLSearchParams(location.search);
            const mode = searchParams.get('mode');
            const oobCode = searchParams.get('oobCode');

            console.log(`Mode: ${mode}, OOB Code: ${oobCode}`);

            if (mode === 'verifyEmail' && oobCode) {
                try {
                    const auth = getAuth();

                    // Verifica se o usuário já está autenticado e se o e-mail foi verificado
                    const user = auth.currentUser;

                    if (user && user.emailVerified) {
                        setMessage('Seu e-mail já foi verificado.');
                    } else {
                        await applyActionCode(auth, oobCode);
                        await auth.currentUser.reload(); // Atualiza o estado do usuário após a aplicação do código

                        if (auth.currentUser.emailVerified) {
                            setMessage('Seu e-mail foi verificado com sucesso. Você será redirecionado em breve.');
                            setTimeout(() => {
                                navigate('/');
                            }, 5000); // Redireciona após 5 segundos
                        } else {
                            setMessage('Ocorreu um erro ao verificar seu e-mail. Por favor, tente novamente.');
                        }
                    }
                } catch (error) {
                    console.error("Erro ao verificar e-mail:", error);
                    if (error.code === 'auth/expired-action-code' || error.code === 'auth/invalid-action-code') {
                        setMessage('O código de verificação é inválido ou já foi usado. Por favor, solicite um novo e-mail de verificação.');
                    } else {
                        setMessage('Ocorreu um erro ao verificar seu e-mail. Por favor, tente novamente.');
                    }
                }
            } else {
                setMessage('Modo ou código inválido.');
            }

            setLoading(false);
        };

        verifyEmail();
    }, [location, navigate]);

    const handleResendVerificationEmail = async () => {
        setLoading(true);
        setMessage(''); // Limpa a mensagem anterior
        try {
            if (currentUser) {
                const auth = getAuth();
                await sendEmailVerification(auth.currentUser);
                setMessage('Um novo e-mail de verificação foi enviado. Por favor, verifique sua caixa de entrada.');
            } else {
                setMessage('Nenhum usuário autenticado.');
            }
        } catch (error) {
            console.error("Erro ao reenviar e-mail de verificação:", error);
            setMessage('Ocorreu um erro ao tentar reenviar o e-mail de verificação. Por favor, tente novamente mais tarde.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Verificação de E-mail</h2>
            {loading ? <p>Verificando...</p> : <p>{message}</p>}
            {!loading && message.includes('O código de verificação é inválido ou já foi usado.') && (
                <button onClick={handleResendVerificationEmail}>
                    Reenviar e-mail de verificação
                </button>
            )}
        </div>
    );
};

export default EmailVerification;
