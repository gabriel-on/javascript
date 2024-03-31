import './App.css'

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// CONTEXT
import { AuthProvider } from './context/AuthContext.jsx';

// PAGINAS
import Home from './pages/Home/Home.jsx';
import Navbar from './components/Navbar/Navbar.jsx';
import Footer from './components/Footer/Footer.jsx';

function App() {

  return (
    <div className='App'>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <div className='container'>
            <Routes>
              <Route path='/' element={<Home />} />
            </Routes>
          </div>
        </BrowserRouter>
        <Footer />
      </AuthProvider>
    </div>
  )
}

export default App
