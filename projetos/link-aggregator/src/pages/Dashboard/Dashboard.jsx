import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuthentication';
import useLinks from '../../hooks/useLinks';
import { NavLink } from 'react-router-dom';
import UserProfileEditor from '../../components/UserProfileEditor/UserProfileEditor';
import { getAuth } from "firebase/auth";
import ProfileCustomization from '../../components/ProfileCustomization/ProfileCustomization';
import Spinner from '../../components/Spinner/Spinner';
import LinkManager from '../../components/LinkManager/LinkManager';
import './Dashboard.css';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const { links, addLink, editLink, deleteLink } = useLinks(currentUser ? currentUser.uid : null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const auth = getAuth();
        await auth.currentUser.reload();
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  if (isLoading) {
    return <Spinner />;
  }

  if (!currentUser) {
    return (
      <div>
        <p>Faça <NavLink to="/login">Login</NavLink> para visualizar seu dashboard.</p>
      </div>
    );
  }

  return (
    <div className='dashboard-container'>
      <h1>Dashboard</h1>
      <UserProfileEditor />
      <h2>Configurações Adicionais</h2>
      <ProfileCustomization userId={currentUser.uid} />

      <div>
        {currentUser.emailVerified ? (
          <p style={{ color: 'green' }}>✅ Seu e-mail está verificado!</p>
        ) : (
          <p style={{ color: 'red' }}>⚠️ Seu e-mail não foi verificado. Verifique sua caixa de entrada.</p>
        )}
      </div>

      <ul>
        <li className='profile-link-page'>
          <NavLink to={`/${currentUser.mentionName}`}>Ver Perfil</NavLink>
        </li>
      </ul>

      {/* Utilize o componente LinkManager aqui */}
      <LinkManager
        links={links.filter(link => link.userId === currentUser.uid)}
        addLink={addLink}
        editLink={editLink}
        deleteLink={deleteLink}
        emailVerified={currentUser.emailVerified}
      />
    </div>
  );
};

export default Dashboard;
