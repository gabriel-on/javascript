// src/pages/UserProfile/UserProfile.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { database } from '../../firebase/config';
import ProfilePicture from '../../components/ProfilePicture/ProfilePicture';
import ShareModal from '../../components/ShareModal/ShareModal';

const UserProfile = () => {
    const { mentionName } = useParams();
    const [links, setLinks] = useState([]);
    const [userId, setUserId] = useState(null);
    const [banner, setBanner] = useState({ image: '', color: '#ffffff' });
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedLink, setSelectedLink] = useState(null);

    useEffect(() => {
        const fetchUserId = () => {
            const usersRef = ref(database, 'users');
            onValue(usersRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    for (const key in data) {
                        if (data[key].mentionName === mentionName) {
                            setUserId(key);
                            break;
                        }
                    }
                }
            });
        };

        fetchUserId();
    }, [mentionName]);

    useEffect(() => {
        if (userId) {
            const bannerRef = ref(database, `users/${userId}/banner`);
            onValue(bannerRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    setBanner(data);
                }
            });

            const linksRef = ref(database, 'links');
            onValue(linksRef, (snapshot) => {
                const data = snapshot.val();
                const linkList = data
                    ? Object.keys(data).map(key => ({
                        id: key,
                        ...data[key]
                    }))
                    : [];

                const userLinks = linkList.filter(link => link.userId === userId);
                setLinks(userLinks);
            });
        }
    }, [userId]);

    const handleShareClick = (link) => {
        setSelectedLink(link);
        setModalOpen(true);
    };

    const handleProfileShareClick = () => {
        const profileLink = `${window.location.origin}/${mentionName}`;
        const profileData = { url: profileLink, title: `Perfil de @${mentionName}` };
        setSelectedLink(profileData);
        setModalOpen(true);
    };

    return (
        <div>
            <div className="banner" style={{ backgroundColor: banner.color, backgroundImage: `url(${banner.image})`, backgroundSize: 'cover', height: '150px', width: '100%', borderRadius: '8px', marginBottom: '10px' }}></div>
            {userId && <ProfilePicture userId={userId} />}
            <h1>@{mentionName}</h1>
            <button onClick={handleProfileShareClick} style={{ marginBottom: '20px' }}>
                Compartilhar Perfil
            </button>
            <ul>
                {links.length > 0 ? (
                    links.map(link => (
                        <li key={link.id}>
                            <a href={link.url} target="_blank" rel="noopener noreferrer">{link.title}</a>
                            <button onClick={() => handleShareClick(link)} style={{ marginLeft: '10px' }}>⋮</button>
                        </li>
                    ))
                ) : (
                    <li>Nenhum link disponível para este usuário.</li>
                )}
            </ul>
            <ShareModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                link={selectedLink}
            />
        </div>
    );
};

export default UserProfile;
