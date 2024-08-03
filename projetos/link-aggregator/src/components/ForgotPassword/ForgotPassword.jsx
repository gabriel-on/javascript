import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuthentication';
import { Link } from 'react-router-dom';
import './ForgotPassword.css'

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { sendPasswordResetEmail } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage('');
        setError('');

        try {
            const response = await sendPasswordResetEmail(email);
            setMessage(response);
        } catch (err) {
            setError(err);
        }
    };

    return (
        <div className="forgot-password">
            <h1>Esqueceu sua Senha?</h1>
            <p>Digite seu e-mail abaixo para receber um link de redefinição de senha.</p>
            <form onSubmit={handleSubmit}>
                <label>
                    <span>E-mail:</span>
                    <input
                        type="email"
                        required
                        placeholder="Seu e-mail"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </label>
                <button className="btn">Enviar link de redefinição</button>
                {message && <p className="success">{message}</p>}
                {error && <p className="error">{error}</p>}
            </form>
            <p>Já tem uma conta? <Link to="/login">Entre aqui</Link>.</p>
        </div>
    );
};

export default ForgotPassword;
