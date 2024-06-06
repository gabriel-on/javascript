import React from 'react';
import '../Home/Home.css';
import { Link } from 'react-router-dom';
import Game from '../Game/Game';

const Home = () => {

  return (
    <div className='home-container'>
      <Game/>
    </div>
  );
};

export default Home;