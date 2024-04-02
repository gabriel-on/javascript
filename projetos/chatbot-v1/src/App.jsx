import './App.css';

import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, get, set } from 'firebase/database';

//HOOK
import { useAuth } from './hooks/useAuthentication.jsx';

// CONTEXT
import { AuthProvider } from './context/AuthContext.jsx';

// PAGINAS
import Home from './pages/Home/Home.jsx';
import Navbar from './components/Navbar/Navbar.jsx';
import Footer from './components/Footer/Footer.jsx';
import Register from './pages/Register/Register.jsx';
import Login from './pages/Login/Login.jsx';

function App() {
  const [user, setUser] = useState(undefined);
  const { auth } = useAuth();
  const [loading, setLoading] = useState(true);
  
  const isAdmin = user && user.isAdmin;
  const userId = user ? user.uid : null;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        const database = getDatabase();
        const dbRef = ref(database, 'users/' + user.uid);

        try {
          const snapshot = await get(dbRef);

          if (snapshot.exists()) {
            const userData = snapshot.val();
            const isAdmin = userData.isAdmin || false;
            setUser((prevUser) => ({ ...prevUser, isAdmin }));
          } else {
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  return (
    <div className='App'>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <div className='container'>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/login' element={!user ? <Login /> : <Navigate to={`/profile/${user.userId}`} />} />
              <Route path='/register' element={!user ? <Register /> : <Navigate to="/" />} />
            </Routes>
          </div>
        </BrowserRouter>
        <Footer />
      </AuthProvider>
    </div>
  );
}

export default App;
