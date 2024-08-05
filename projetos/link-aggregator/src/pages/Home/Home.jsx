import React from 'react';
import './Home.css';
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
        <UserList />
      </main>
    </div>
  );
}

export default Home;
