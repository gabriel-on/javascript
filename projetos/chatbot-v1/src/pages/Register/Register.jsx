import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuthentication';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getDatabase, ref, set } from 'firebase/database'; // Importe o método set para escrever dados no Realtime Database
import { Link } from 'react-router-dom';

const Register = () => {
  const [displayName, setDisplayName] = useState('');
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
      email,
      password,
    };

    console.log('Dados de usuário a serem registrados:', userCredentials);

    try {
      console.log('Enviando solicitação de registro...');
      
      // Chame a função createUser fornecida pelo seu hook useAuthentication
      const res = await createUser(userCredentials);

      console.log('Resposta do registro:', res);

      // Check if the user creation was successful before trying to set the user role
      if (res && res.user) {
        console.log('Usuário registrado com sucesso. Adicionando ao Firestore e ao Realtime Database...');
        
        // Adicione o usuário ao Firestore
        const firestore = getFirestore();
        const userRef = collection(firestore, 'users');
        await addDoc(userRef, {
          uid: res.user.uid,
          displayName,
          email,
          role: 'user',
        });

        // Adicione um novo nó para o usuário no Realtime Database
        const database = getDatabase();
        const userDatabaseRef = ref(database, 'users/' + res.user.uid);
        await set(userDatabaseRef, {
          displayName,
          email,
          role: 'user',
        });

        console.log('Usuário adicionado ao Firestore e ao Realtime Database com sucesso.');
      }

    } catch (error) {
      console.error('Erro ao criar o usuário:', error);
      setError('Erro ao criar o usuário: ' + error.message);
    }
  };

  useEffect(() => {
    if (authError) {
      console.error('Erro de autenticação:', authError);
      setError(authError);
    }
  }, [authError]);

  return (
    <div className="register">
      <h1>Cadastre-se</h1>
      <h2>E tenha beneficios</h2>
      <p>Crie seu usuário</p>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Nome:</span>
          <input type="text" name="displayName" required placeholder="Nome do usuário" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        </label>
        <label>
          <span>E-mail:</span>
          <input type="email" name="email" required placeholder="E-mail do usuário" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          <span>Senha:</span>
          <input type="password" name="password" required placeholder="Insira sua senha" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <label>
          <span>Confirmação de senha:</span>
          <input type="password" name="confirmPassword" required placeholder="Confirme a sua senha" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
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