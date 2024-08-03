import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAuth, applyActionCode, sendEmailVerification } from "firebase/auth";
import { getDatabase, ref, update } from "firebase/database";

const EmailVerification = () => {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const auth = getAuth();

    useEffect(() => {
        const verifyEmail = async () => {
            const searchParams = new URLSearchParams(location.search);
            const mode = searchParams.get('mode');
            const oobCode = searchParams.get('oobCode');
            const user = auth.currentUser;

            // Verifica se o usuário está autenticado
            if (!user) {
                setMessage('Você precisa estar logado para verificar seu e-mail.');
                setLoading(false);
                return;
            }

            // Verifica se o modo e o oobCode são válidos
            if (mode === 'verifyEmail' && oobCode) {
                try {
                    await applyActionCode(auth, oobCode);
                    await auth.currentUser.reload(); // Atualiza o estado do usuário após a aplicação do código

                    if (auth.currentUser.emailVerified) {
                        const db = getDatabase();
                        await update(ref(db, 'users/' + user.uid), { emailVerified: true });

                        setMessage('Seu e-mail foi verificado com sucesso. Você será redirecionado em breve.');
                        setTimeout(() => {
                            navigate('/dashboard');
                        }, 3000); // Redireciona após 3 segundos
                    } else {
                        setMessage('Ocorreu um erro ao verificar seu e-mail. Por favor, tente novamente.');
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
    }, [location, navigate, auth]);

    const handleResendVerificationEmail = async () => {
        setLoading(true);
        setMessage(''); // Limpa a mensagem anterior
        const user = auth.currentUser;

        if (user) {
            try {
                await sendEmailVerification(user);
                setMessage('Um novo e-mail de verificação foi enviado. Por favor, verifique sua caixa de entrada.');
            } catch (error) {
                console.error("Erro ao reenviar e-mail de verificação:", error);
                setMessage('Ocorreu um erro ao tentar reenviar o e-mail de verificação. Por favor, tente novamente mais tarde.');
            }
        } else {
            setMessage('Nenhum usuário autenticado.');
        }

        setLoading(false);
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
