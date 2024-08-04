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
import Breadcrumb from './components/Breadcrumb/Breadcrumb.jsx';
import ToTop from './components/ToTop/ToTop.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import Edit from './pages/Edit/Edit.jsx';
import ErrorPage from './pages/ErrorPage/ErrorPage.jsx';
import UserProfile from './pages/UserProfile/UserProfile.jsx';
import EmailVerification from './components/EmailVerification/EmailVerification.jsx';
import ForgotPassword from './components/ForgotPassword/ForgotPassword.jsx';
import Spinner from './components/Spinner/Spinner';
import TermsOfService from './components/LegalDocuments/TermsOfService.jsx';
import PrivacyPolicy from './components/LegalDocuments/PrivacyPolicy.jsx';
import CookieManager from './components/LegalDocuments/CookieManager.jsx';

function App() {
  const [user, setUser] = useState(undefined);
  const { auth } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userId = user.uid; // Obtém o ID do usuário
        console.log('ID do usuário:', userId);

        const database = getDatabase();
        const dbRef = ref(database, 'users/' + userId);

        try {
          const snapshot = await get(dbRef);
          if (snapshot.exists()) {
            console.log('Dados do usuário:', snapshot.val());
          } else {
            console.log('Usuário não encontrado no banco de dados.');
          }
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
        }
      }
      setUser(user); // Define o usuário após verificar os dados
      setLoading(false); // Certifique-se de definir o estado de carregamento aqui
    });

    return () => unsubscribe();
  }, [auth]);

  const userId = user ? user.uid : null;

  if (loading) {
    return <Spinner />; // Use o Spinner aqui
  }

  return (
    <div className='App'>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <div className='container'>
            <Routes>
              <Route path="/error" element={<ErrorPage />} />
              <Route path="*" element={<Navigate to="/error" />} />

              <Route path="/email-verification/" element={<EmailVerification />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              <Route path="/:mentionName" element={<UserProfile />} />
              <Route path='/' element={<Home />} />

              <Route path='/dashboard' element={<Dashboard userId={userId} />} />

              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />

              <Route path='/login' element={!user ? <Login /> : <Navigate to={`/dashboard/`} />} />
              <Route path='/register' element={!user ? <Register /> : <Navigate to="/dashboard" />} />
            </Routes>
          </div>
          <CookieManager />
          <ToTop />
          <Footer />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
