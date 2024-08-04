import React from 'react';
import { NavLink } from 'react-router-dom';
import '../Footer/Footer.css';

function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <p>&copy; Alpha - Version: 1.0</p>
        <div className="links-associate">
          <NavLink to="/terms-of-service">Termos de Uso</NavLink>
          <span> | </span>
          <NavLink to="/privacy-policy">Política de Privacidade</NavLink>
          <span> | </span>
          <NavLink to="/contact">Contato</NavLink>
          <span> | </span>
          <NavLink to="/faq">FAQ</NavLink>
        </div>
      </div>
    </footer>
  );
}

export default Footer;