import React from 'react';
import '../Home/Home.css';
import { Link } from 'react-router-dom';
import GameRoom from '../../components/GameRoom/GameRoom';
import Lobby from '../../components/Lobby/Lobby';

const Home = () => {

  return (
    <div className='home-container'>
      <GameRoom/>
      <Lobby/>
    </div>
  );
};

export default Home;