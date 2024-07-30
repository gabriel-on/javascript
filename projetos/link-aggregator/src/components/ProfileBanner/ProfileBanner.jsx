// src/components/ProfileBanner/ProfileBanner.jsx
import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../firebase/config';
import './ProfileBanner.css';

const ProfileBanner = ({ userId }) => {
    const [bannerImage, setBannerImage] = useState('');
    const [bgColor, setBgColor] = useState('#ffffff');

    useEffect(() => {
        const fetchBannerData = async () => {
            const bannerRef = ref(database, `users/${userId}/banner`);
            onValue(bannerRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    setBannerImage(data.image || '');
                    setBgColor(data.color || '#ffffff');
                }
            });
        };

        if (userId) {
            fetchBannerData();
        }
    }, [userId]);

    return (
        <div
            className="profile-banner"
            style={{
                backgroundImage: `url(${bannerImage})`,
                backgroundColor: bgColor,
                backgroundSize: 'cover',
                height: '150px',
                width: '100%',
                borderRadius: '8px',
                position: 'relative',
            }}
        >
            {!bannerImage && !bgColor && <p>Sem Banner</p>}
        </div>
    );
};

export default ProfileBanner;
