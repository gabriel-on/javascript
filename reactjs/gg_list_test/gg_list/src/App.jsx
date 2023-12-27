// App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthContext/AuthContext';
import PrivateRoute from './components/PrivateRoute/PrivateRoute.jsx';
import Home from './routes/home/Home.jsx';
import NewPost from './routes/new/NewPost.jsx';
import Admin from './routes/admin/Admin.jsx';
import EditPost from './routes/edit/EditPost.jsx';
import Post from './routes/post/Post.jsx';
import Dev from './routes/dev/dev.jsx';
import Searchbar from './components/searchbar/Searchbar.jsx';
import ErrorPage from './components/ErrorPage/ErrorPage.jsx';
import Login from './components/Login/Login.jsx';
import Footer from './components/Footer/Footer';
import Navbar from './components/nav/Navbar';
import Breadcrumb from './components/Breadcrumb/Breadcrumb';
import ScrollToTopButton from './components/ScrollToTopButton/ScrollToTopButton';

function App() {
  // const { user } = useAuth();
  // const [authChecked, setAuthChecked] = useState(false);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setAuthChecked(true);
  //   }, 1000);
  // }, []);

  // if (!authChecked) {
  //   return <p>Carregando...</p>;
  // }

  return (
    <div className='App'>
      <AuthProvider>
        <BrowserRouter>
          <Breadcrumb />
          <Navbar />
          <div className='container'>
            <Routes>
              <Route
                path="/"
                element={<Home />} />
              <Route path="/developers" element={<Dev />} />
              <Route path="/posts/:id" element={<Post />} />
              <Route path="/new" element={<NewPost/> }/>
              <Route path="/admin" element={<Admin/> }/>
              <Route path="/posts/edit/:id" element={<EditPost />} />
              <Route path="/search" element={<Searchbar />} />
              <Route path="/login" element={<Login />} />
              <Route path="/login" element={<Navigate to="/" />} />
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </div>
          <ScrollToTopButton />
          <Footer />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;