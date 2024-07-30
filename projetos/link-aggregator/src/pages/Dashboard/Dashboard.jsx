import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuthentication';
import { getDatabase, ref, onValue, push } from 'firebase/database';
import { getUnixTime } from 'date-fns';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [links, setLinks] = useState([]);

  const database = getDatabase();

  useEffect(() => {
    if (currentUser) {
      const linksRef = ref(database, 'links');
      onValue(linksRef, (snapshot) => {
        const data = snapshot.val();
        const linkList = data ? Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })) : [];
        setLinks(linkList);
      });
    }
  }, [currentUser, database]);

  const handleAddLink = () => {
    if (title && url) {
      const linksRef = ref(database, 'links');
      const newLink = {
        title,
        url,
        userId: currentUser.uid, // Armazenar o ID do usuário
        createdAt: getUnixTime(new Date()), // Armazenar a data de criação como timestamp UNIX
      };
      push(linksRef, newLink);
      setTitle('');
      setUrl('');
    }
  };

  if (!currentUser) {
    return <p>Please log in to view your dashboard.</p>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
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
