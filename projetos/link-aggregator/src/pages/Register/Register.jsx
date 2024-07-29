import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuthentication';
import { Link } from 'react-router-dom';

const Register = () => {
    const [displayName, setDisplayName] = useState('');
    const [mentionName, setMentionName] = useState(''); // Novo estado para o nome de menção
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const { createUser, error: authError, loading } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('As senhas precisam ser iguais.');
            return;
        }

        const userCredentials = {
            displayName,
            mentionName, // Adiciona o campo mentionName
            email,
            password,
        };

        try {
            await createUser(userCredentials);
        } catch (error) {
            setError('Erro ao criar o usuário: ' + error.message);
        }
    };

    useEffect(() => {
        if (authError) {
            setError(authError);
        }
    }, [authError]);

    return (
        <div className="register">
            <h1>Cadastre-se para postar</h1>
            <p>Crie seu usuário</p>
            <form onSubmit={handleSubmit}>
                <label>
                    <span>Nome:</span>
                    <input
                        type="text"
                        name="displayName"
                        required
                        placeholder="Nome do usuário"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                    />
                </label>
                <label>
                    <span>Nome de Menção (sem espaços):</span>
                    <input
                        type="text"
                        name="mentionName"
                        required
                        placeholder="Nome para menção"
                        value={mentionName}
                        onChange={(e) => setMentionName(e.target.value)}
                    />
                </label>
                <label>
                    <span>E-mail:</span>
                    <input
                        type="email"
                        name="email"
                        required
                        placeholder="E-mail do usuário"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </label>
                <label>
                    <span>Senha:</span>
                    <input
                        type="password"
                        name="password"
                        required
                        placeholder="Insira sua senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                <label>
                    <span>Confirmação de senha:</span>
                    <input
                        type="password"
                        name="confirmPassword"
                        required
                        placeholder="Confirme a sua senha"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </label>
                {!loading && <button className="btn">Cadastrar</button>}
                {loading && <button className="btn" disabled>Aguarde...</button>}
                {error && <p className="error">{error}</p>}
            </form>
            <p>Já tem uma conta? <Link to="/login">Faça o login</Link>.</p>
        </div>
    );
};

export default Register;