import './App.css';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// PÁGINAS
import Home from './pages/Home/Home.jsx';
import Navbar from './components/Navbar/Navbar.jsx';
import Footer from './components/Footer/Footer.jsx';
import MusicList from './components/MusicList/MusicList.jsx';

function App() {

  return (
    <div className='App'>
      <BrowserRouter>
        <Navbar />
        <div className='container'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/search' element={<MusicList />} />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;