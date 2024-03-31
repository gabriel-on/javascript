import './App.css';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// import { onAuthStateChanged } from 'firebase/auth';
// import { useState, useEffect } from 'react';
// import { getDatabase, ref, get, set } from 'firebase/database';

// HOOKS
import { useAuth } from './hooks/useAuthentication.jsx';

// CONTEXT
import { AuthProvider } from './context/AuthContext.jsx';

// PAGINAS
import Home from './Pages/Home/Home.jsx';
import Welcome from './Pages/Welcome/Welcome.jsx';
import Navbar from './components/Navbar/Navbar.jsx'
import Footer from './components/Footer/Footer.jsx'
import Editor from './Pages/Editor/Editor.jsx';

function App() {

  return (
    <div className='App'>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <div className='container'>
            <Routes>
              <Route path='/welcome' element={<Welcome />} />
              <Route path='/' element={<Home />} />
              <Route path='/editor' element={<Editor />}/>
            </Routes>
          </div>
          <Footer />
        </BrowserRouter>
      </AuthProvider>
    </div>
  )
}

export default App