import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuthentication';
import useLinks from '../../hooks/useLinks';
import { NavLink } from 'react-router-dom';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  // Usando o hook useLinks
  const { links, addLink } = useLinks(currentUser ? currentUser.uid : null);

  if (!currentUser) {
    return <p>Please log in to view your dashboard.</p>;
  }

  const handleAddLink = () => {
    if (title && url) {
      addLink(title, url); // Adiciona o link usando o hook
      setTitle('');
      setUrl('');
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
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
            .filter(link => link.userId === currentUser.uid) // Filtra os links para mostrar apenas os do usuário atual
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
