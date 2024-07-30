// src/pages/Dashboard/Dashboard.jsx
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuthentication';
import useLinks from '../../hooks/useLinks';
import { NavLink } from 'react-router-dom';
import ProfilePictureUploader from '../../components/ProfilePictureUploader/ProfilePictureUploader'; // Importando o novo componente

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  const { links, addLink } = useLinks(currentUser ? currentUser.uid : null);

  if (!currentUser) {
    return <p>Faça <a href="/login">Login</a> para visualizar seu dashboard.</p>;
  }

  const handleAddLink = () => {
    if (title && url) {
      addLink(title, url);
      setTitle('');
      setUrl('');
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <ProfilePictureUploader />
      <ul>
        {currentUser && (
          <li className='profile-link-page'>
            <NavLink to={`/${currentUser.mentionName}`}>Ver ou Compartilhar link</NavLink>
          </li>
        )}
      </ul>
      <div>
        <h2>Add a new link</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="URL"
        />
        <button onClick={handleAddLink}>Add Link</button>
      </div>
      <div>
        <h2>Your Links</h2>
        <ul>
          {links
            .filter(link => link.userId === currentUser.uid)
            .map(link => (
              <li key={link.id}>
                <a href={link.url} target="_blank" rel="noopener noreferrer">{link.title}</a>
                <span> (Added on: {new Date(link.createdAt * 1000).toLocaleString()})</span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
