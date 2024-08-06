import React from 'react';
import { NavLink } from 'react-router-dom';
import '../Footer/Footer.css';

function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <>
          <p>&copy; 2024 HIGHLINKS. Todos os direitos reservados.</p>
          <p>Alpha - Version: 2.0</p>
        </>
        <div className="links-associate">
          <NavLink to="/terms-of-service">Termos de Uso</NavLink>
          <span> | </span>
          <NavLink to="/privacy-policy">Política de Privacidade</NavLink>
          <span> | </span>
          <NavLink to="/contact">Contato</NavLink>
          <span> | </span>
          <NavLink to="/faqs">FAQs</NavLink>
        </div>
      </div>
    </footer>
  );
}

export default Footer;