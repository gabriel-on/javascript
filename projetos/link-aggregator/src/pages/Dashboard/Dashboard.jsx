import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuthentication';
import useLinks from '../../hooks/useLinks';
import { NavLink } from 'react-router-dom';
import ProfilePictureUploader from '../../components/ProfilePictureUploader/ProfilePictureUploader';
import BannerUploader from '../../components/BannerUploader/BannerUploader';
import Modal from '../../components/Modal/Modal';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [selectedLink, setSelectedLink] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const { links, addLink, editLink, deleteLink } = useLinks(currentUser ? currentUser.uid : null);

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

  const handleEditLink = (id, newTitle, newUrl) => {
    editLink(id, newTitle, newUrl);
  };

  const handleDeleteLink = (id) => {
    deleteLink(id);
  };

  const openModal = (link) => {
    setSelectedLink(link);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedLink(null);
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {/* <ProfilePictureUploader /> */}
      {/* <BannerUploader /> */}
      <ul>
        {currentUser && (
          <li className='profile-link-page'>
            <NavLink to={`/${currentUser.mentionName}`}>Ver Links</NavLink>
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
                <button onClick={() => openModal(link)}>Edit</button>
                <span> (Added on: {new Date(link.createdAt * 1000).toLocaleString()})</span>
              </li>
            ))}
        </ul>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        link={selectedLink}
        onEdit={handleEditLink}
        onDelete={handleDeleteLink}
      />
    </div>
  );
};

export default Dashboard;
