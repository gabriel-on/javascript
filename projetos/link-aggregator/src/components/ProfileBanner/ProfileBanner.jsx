import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../firebase/config';
import './ProfileBanner.css';

const ProfileBanner = ({ userId }) => {
    const [bannerData, setBannerData] = useState({ image: '', color: '#ffffff', imageUpdatedAt: null, colorUpdatedAt: null });

    useEffect(() => {
        if (userId) {
            const bannerRef = ref(database, `users/${userId}/banner`);
            onValue(bannerRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    setBannerData(data);
                }
            });
        }
    }, [userId]);

    const displayBanner = () => {
        if (bannerData.imageUpdatedAt && bannerData.colorUpdatedAt) {
            return new Date(bannerData.imageUpdatedAt) > new Date(bannerData.colorUpdatedAt)
                ? { backgroundImage: `url(${bannerData.image})`, backgroundColor: 'transparent' }
                : { backgroundImage: 'none', backgroundColor: bannerData.color };
        } else if (bannerData.imageUpdatedAt) {
            return { backgroundImage: `url(${bannerData.image})`, backgroundColor: 'transparent' };
        } else if (bannerData.colorUpdatedAt) {
            return { backgroundImage: 'none', backgroundColor: bannerData.color };
        }
        return { backgroundImage: 'none', backgroundColor: '#ffffff' }; // Cor padrão
    };

    return (
        <div
            className="profile-banner"
            style={{
                ...displayBanner(),
                backgroundSize: 'cover',
                height: '200px',
                width: '100%',
                borderRadius: '8px',
            }}
        >
            {!bannerData.image && !bannerData.color && <p>Sem Banner</p>}
        </div>
    );
};

export default ProfileBanner;
