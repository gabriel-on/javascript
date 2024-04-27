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
import CharacterSheet from './pages/CharacterSheet/CharacterSheet.jsx';
import CharacterDetails from './pages/CharacterDetails/CharacterDetails.jsx';
import CharacterEditor from './components/CharacterEditor/CharacterEditor.jsx';
import CharacterGame from './components/CharacterGame/CharacterGame.jsx';

function App() {
  const [user, setUser] = useState(undefined);
  const { auth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [characterData, setCharacterData] = useState(null); // Estado para armazenar os dados do personagem

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        const userId = user.uid; // Obtém o ID do usuário
        console.log('ID do usuário:', userId); // Imprime o ID do usuário no console

        const database = getDatabase();
        const dbRef = ref(database, 'users/' + userId);

        try {
          const snapshot = await get(dbRef);

          if (snapshot.exists()) {
            const userData = snapshot.val();
            const isAdmin = userData.isAdmin || false;
            setUser((prevUser) => ({ ...prevUser, isAdmin }));
            setCharacterData(userData.character); // Define os dados do personagem
            console.log('Dados do usuário:', userData); // Adiciona um console.log aqui
          }
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
        }
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  // Define userId com base no usuário autenticado
  const userId = user ? user.uid : null;

  return (
    <div className='App'>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <div className='container'>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/character-details/:characterId' element={<CharacterDetails userId={userId} />} />
              <Route
                path='/character-editor/:characterId'
                element={<CharacterEditor userId={userId} />}
              />
              <Route
                path='/character-game'
                element={<CharacterGame userId={userId} />}
              />
              {userId && (
                <Route path='/character-sheet' element={<CharacterSheet />} />
              )}
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