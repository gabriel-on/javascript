import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuthentication';
import './Navbar.css';

function Navbar() {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode === 'true';
  });

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    // Adicione ou remova classes de tema do body
    document.body.className = isDarkMode ? 'dark-mode' : 'light-mode';
    // Salve o estado do modo escuro no localStorage
    localStorage.setItem('darkMode', isDarkMode);
  }, [isDarkMode]);

  return (
    <div className={`navbar-container ${isScrolled ? 'scrolled' : ''}`}>
      <div className='navbar'>
        <ul>
          <li className='brand'>
            <NavLink to={"/"}>
              <h1>HighLinks</h1>
            </NavLink>
          </li>
        </ul>
        <ul>
          {currentUser && (
            <li className='nav-page'>
              <NavLink to={"/dashboard"}>Dashboard</NavLink>
            </li>
          )}
          {!currentUser && (
            <li>
              <NavLink to={"/login"}>Entrar</NavLink>
            </li>
          )}
          {!currentUser && (
            <li>
              <NavLink to={"/register"}>Cadastrar</NavLink>
            </li>
          )}
          <li className='display-name'>
            <span>Olá, {currentUser ? currentUser.displayName : 'Visitante'}!</span>
          </li>
          {currentUser && (
            <li className='logout-btn'>
              <button onClick={handleLogout}>Sair</button>
            </li>
          )}
          <li>
            <button onClick={toggleDarkMode}>
              {isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
