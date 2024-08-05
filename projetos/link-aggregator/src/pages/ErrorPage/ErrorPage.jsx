import React from 'react';
import './ErrorPage.css'; // Importa o CSS

function ErrorPage() {
  return (
    <div className="error-page">
      <h1>404</h1>
      <p>Página não encontrada</p>
      <a href="/" className="home-link">Voltar para a página inicial</a>
    </div>
  );
}

export default ErrorPage;
