import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuthentication';

function Navbar() {
  const { currentUser, logout } = useAuth(); // Importe o currentUser e a função de logout do seu hook de autenticação

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <div>
      <ul>
        <li>
          <NavLink to={"/"}>Home</NavLink>
        </li>
        {/* Renderize o link de login somente se o usuário não estiver autenticado */}
        {!currentUser && (
          <li>
            <NavLink to={"/login"}>Login</NavLink>
          </li>
        )}
        {/* Renderize o link de cadastro somente se o usuário não estiver autenticado */}
        {!currentUser && (
          <li>
            <NavLink to={"/register"}>Cadastrar</NavLink>
          </li>
        )}
        {/* Renderize o botão de sair somente se o usuário estiver autenticado */}
        {currentUser && (
          <li>
            <button onClick={handleLogout}>Sair</button>
          </li>
        )}
      </ul>
    </div>
  );
}

export default Navbar;
