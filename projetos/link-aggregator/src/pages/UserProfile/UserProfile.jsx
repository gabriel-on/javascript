import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { database } from '../../firebase/config';
import ProfilePicture from '../../components/ProfilePicture/ProfilePicture';
import ProfileBanner from '../../components/ProfileBanner/ProfileBanner';
import ShareModal from '../../components/ShareModal/ShareModal';
import './UserProfile.css';

const UserProfile = () => {
    const { mentionName } = useParams();
    const [links, setLinks] = useState([]);
    const [userId, setUserId] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedLink, setSelectedLink] = useState(null);
    const [userStyles, setUserStyles] = useState({ fontFamily: 'Arial', textColor: '#FFF' });

    useEffect(() => {
        const fetchUserId = () => {
            const usersRef = ref(database, 'users');
            onValue(usersRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    for (const key in data) {
                        if (data[key].mentionName === mentionName) {
                            setUserId(key);
                            // Armazena a fonte e cor do usuário
                            setUserStyles({
                                fontFamily: data[key].fontFamily || 'Arial',
                                textColor: data[key].textColor || '#FFF',
                            });
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

            // Recupera as configurações de personalização do usuário
            const customizationsRef = ref(database, `users/${userId}/customizations`);
            onValue(customizationsRef, (snapshot) => {
                const customizations = snapshot.val();
                if (customizations) {
                    setUserStyles({
                        fontFamily: customizations.fontFamily || 'Arial',
                        textColor: customizations.textColor || '#000',
                    });
                }
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
        <div className='user-container'>
            <div className='profile-user'>
                {userId && <ProfileBanner userId={userId} />}
            </div>
            <div className='user-links-container' style={{ fontFamily: userStyles.fontFamily, color: userStyles.textColor }}>
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
                                <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ color: userStyles.textColor }}>{link.title}</a>
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
