import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuthentication';
import { Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { login, error: authError, loading } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const userCredentials = {
            email,
            password,
        };

        const res = await login(userCredentials);

        if (res && res.user) {
            console.log('Login bem-sucedido:', res.user);
        }
    };

    useEffect(() => {
        if (authError) {
            setError(authError);
        }
    }, [authError]);

    return (
        <div className="login">
            <h1>Entrar</h1>
            <p>Faça o login para poder utilizar o sistema</p>
            <form onSubmit={handleSubmit}>
                <label>
                    <span>E-mail:</span>
                    <input
                        type="email"
                        name="email"
                        required
                        placeholder="E-mail do usuário"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </label>
                <label>
                    <span>Senha:</span>
                    <input
                        type="password"
                        name="password"
                        required
                        placeholder="Sua senha"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                {!loading && <button className="btn">Entrar</button>}
                {loading && (
                    <button className="btn" disabled>
                        Aguarde...
                    </button>
                )}
                {error && <p className="error">{error}</p>}
            </form>
            <p>Esqueceu a Senha? <Link to="/forgot-password">Clique Aqui</Link>.</p>
            <p>Não tem uma conta? <Link to="/register">Cadastre-se</Link>.</p>
        </div>
    );
};

export default Login;