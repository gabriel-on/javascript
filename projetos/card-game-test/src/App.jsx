import './App.css';

import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';

// HOOK
import { useAuth } from './hooks/useAuthentication.jsx';

// CONTEXT
import { AuthProvider } from './context/AuthContext.jsx';

// PÁGINAS
import Home from './pages/Home/Home.jsx';
import Navbar from './components/Navbar/Navbar.jsx';
import Footer from './components/Footer/Footer.jsx';
import Register from './pages/Register/Register.jsx';
import Login from './pages/Login/Login.jsx';
import Sidebar from './components/Sidebar/Sidebar.jsx';

function App() {
  const [user, setUser] = useState(null);
  const { auth } = useAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userId = user.uid;
        console.log('ID do usuário:', userId);
        const database = getDatabase();
        const dbRef = ref(database, 'users/' + userId);

        try {
          const snapshot = await get(dbRef);

          if (snapshot.exists()) {
            const userData = snapshot.val();
            const isAdmin = userData.isAdmin || false;
            setUser(prevUser => ({ ...prevUser, isAdmin }));
            console.log('Dados do usuário:', userData);
          }
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
        }
      } else {
        console.log("No user signed in.");
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  if (user === undefined) {
    return <p className='loading-app'>Carregando...</p>;
  }

  return (
    <div className='App'>
      <AuthProvider value={{ user }}>
        <BrowserRouter>
          <Navbar />
          <div className='container'>
            <Sidebar />
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/login' element={!user ? <Login /> : <Navigate to={`/`} />} />
              <Route path='/register' element={!user ? <Register /> : <Navigate to="/" />} />
            </Routes>
          </div>
          <Footer />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;