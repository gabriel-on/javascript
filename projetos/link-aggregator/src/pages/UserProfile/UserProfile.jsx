// src/pages/UserProfile/UserProfile.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { database } from '../../firebase/config';
import ProfilePicture from '../../components/ProfilePicture/ProfilePicture';
import ShareModal from '../../components/ShareModal/ShareModal';

import './UserProfile.css'

const UserProfile = () => {
    const { mentionName } = useParams();
    const [links, setLinks] = useState([]);
    const [userId, setUserId] = useState(null);
    const [banner, setBanner] = useState({ image: '', color: '#ffffff', imageUpdatedAt: null, colorUpdatedAt: null });
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

    // Verifica qual foi a última atualização e decide o que exibir
    const displayBanner = () => {
        if (banner.imageUpdatedAt && banner.colorUpdatedAt) {
            return new Date(banner.imageUpdatedAt) > new Date(banner.colorUpdatedAt)
                ? { backgroundImage: `url(${banner.image})`, backgroundColor: 'transparent' }
                : { backgroundImage: 'none', backgroundColor: banner.color };
        } else if (banner.imageUpdatedAt) {
            return { backgroundImage: `url(${banner.image})`, backgroundColor: 'transparent' };
        } else if (banner.colorUpdatedAt) {
            return { backgroundImage: 'none', backgroundColor: banner.color };
        }
        return { backgroundImage: 'none', backgroundColor: '#ffffff' }; // Cor padrão
    };

    return (
        <div className='user-container'>
            <div className='profile-user'>
                <div className="banner" style={{
                    ...displayBanner(),
                    backgroundSize: 'cover',
                    height: '200px',
                    width: '100%',
                    borderRadius: '8px',
                    marginBottom: '10px'
                }}></div>
            </div>
            <div className='user-links-container'>
                <div className='profile-picture-info'>
                    <div className='profile-info'>
                        {userId && <ProfilePicture userId={userId} />}
                        <div>
                            <h2>@{mentionName}</h2>
                            <h2>{"displayName"}</h2>
                        </div>
                    </div>
                    <button className='share-btn' onClick={handleProfileShareClick}>⋮</button>
                </div>
                <ul className='link-list'>
                    {links.length > 0 ? (
                        links.map(link => (
                            <li key={link.id}>
                                <a href={link.url} target="_blank" rel="noopener noreferrer">{link.title}</a>
                                <button onClick={() => handleShareClick(link)} style={{ marginLeft: '10px' }}>⋮</button>
                            </li>
                        ))
                    ) : (
                        <li>Nenhum link disponível ou usuário não existe.</li>
                    )}
                </ul>
            </div>
            <ShareModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                link={selectedLink}
            />
        </div>
    );
};

export default UserProfile;
