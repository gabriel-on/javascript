import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';
import UserList from '../../components/UserList/UserList';

function Home() {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Bem-vindo ao HIGHLINKS</h1>
        <p>Seu agregador de links personalizado</p>
      </header>
      <main className="home-content">
        <section className="service-presentation">
          <h2>Sobre o HIGHLINKS</h2>
          <p>Com o HIGHLINKS, você pode organizar e compartilhar todos os seus links importantes em um só lugar. Ideal para influenciadores, criadores de conteúdo e qualquer pessoa que precise gerenciar vários links de maneira fácil e eficiente.</p>
        </section>
        <section className="cta-section">
          <h2>Junte-se a Nós!</h2>
          <p>Crie sua conta no HIGHLINKS e comece a organizar seus links agora mesmo!</p>
          <Link to="/register" className="cta-button">Comece Agora</Link>
        </section>
        <UserList />
      </main>
    </div>
  );
}

export default Home;
