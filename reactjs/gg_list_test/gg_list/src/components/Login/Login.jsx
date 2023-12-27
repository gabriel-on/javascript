import React, { useState } from 'react';
import { useAuth } from '../AuthContext/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Simule uma requisição de login bem-sucedida
    const fakeApiResponse = { id: 1, username: 'Usuario1', type: 'comum' };

    // Verifique as credenciais e obtenha os dados do usuário do servidor
    if (username === 'Usuario1' && password === 'senha1') {
      login(fakeApiResponse);
      // Redirecionar para a página após o login (por exemplo, dashboard)
    } else {
      console.error('Login falhou');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label>
          Nome de usuário:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <br />
        <label>
          Senha:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
