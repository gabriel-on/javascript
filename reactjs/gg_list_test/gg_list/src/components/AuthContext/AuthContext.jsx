// AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    // Simulando a verificação do estado de autenticação no json-server
    const fetchAuthStatus = async () => {
      try {
        const response = await fetch('http://localhost:8000/auth');
        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error('Erro ao verificar o estado de autenticação:', error);
      }
    };

    fetchAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }

  return context;
};
