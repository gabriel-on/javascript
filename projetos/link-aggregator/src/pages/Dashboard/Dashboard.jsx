import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuthentication';
import { getDatabase, ref, onValue, push } from 'firebase/database';

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
        url
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
        <h2>Link List</h2>
        <ul>
          {links.map(link => (
            <li key={link.id}>
              <a href={link.url} target="_blank" rel="noopener noreferrer">{link.title}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
