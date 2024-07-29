import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuthentication';
import '../Navbar/Navbar.css';

function Navbar() {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className='navbar-container'>
      <div className='navbar'>
        <ul >
          <li className='nav-page'>
            <NavLink to={"/"}>Home</NavLink>
          </li>
          {currentUser && (
            <li className='nav-page'>
              <NavLink to={"/dashboard"}>Dashboard</NavLink>
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
            <li className='display-name'>
              <span>Olá, {currentUser.displayName}!</span>
            </li>
          )}
          {currentUser && (
            <li className='logout-btn'>
              <button onClick={handleLogout}>Sair</button>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Navbar;