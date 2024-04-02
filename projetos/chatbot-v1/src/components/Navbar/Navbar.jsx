import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuthentication';

function Navbar() {
  const { currentUser, logout } = useAuth();

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
        {currentUser && (
          <li>
            <NavLink to={"/character-sheet"}>Criar</NavLink>
          </li>
        )}
        {!currentUser && (
          <li>
            <NavLink to={"/login"}>Login</NavLink>
          </li>
        )}
        {!currentUser && (
          <li>
            <NavLink to={"/register"}>Cadastrar</NavLink>
          </li>
        )}
        {currentUser && (
          <li>
            <span>Olá, {currentUser.displayName}!</span>
          </li>
        )}
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
