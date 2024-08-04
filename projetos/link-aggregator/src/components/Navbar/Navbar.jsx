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
  const [showLinks, setShowLinks] = useState(false);

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

  const toggleLinksVisibility = () => {
    setShowLinks(prev => !prev);
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
    document.body.className = isDarkMode ? 'dark-mode' : 'light-mode';
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
          <li>
            <button onClick={toggleLinksVisibility} className="toggle-links-btn">
              <i className="bi bi-three-dots-vertical"></i>
            </button>
          </li>
          {showLinks && (
            <div className="nav-links">
              <>
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
              </>
            </div>
          )}
          <li>
            <button onClick={toggleDarkMode} className="dark-mode-toggle">
              {isDarkMode ? (
                <i className="bi bi-sun" title="Modo Claro"></i>
              ) : (
                <i className="bi bi-moon" title="Modo Escuro"></i>
              )}
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
