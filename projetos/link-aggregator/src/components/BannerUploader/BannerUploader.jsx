import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuthentication';
import { getDatabase, ref, set } from 'firebase/database';
import './BannerUploader.css';

const BannerUploader = () => {
    const { currentUser } = useAuth();
    const [bannerImage, setBannerImage] = useState('');
    const [bgColor, setBgColor] = useState('#ffffff');

    useEffect(() => {
        const fetchBannerData = async () => {
            const db = getDatabase();
            const bannerRef = ref(db, `users/${currentUser.uid}/banner`);
            const snapshot = await bannerRef.get();
            if (snapshot.exists()) {
                const data = snapshot.val();
                setBannerImage(data.image || '');
                setBgColor(data.color || '#ffffff');
            }
        };

        if (currentUser) {
            fetchBannerData();
        }
    }, [currentUser]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setBannerImage(reader.result);
                saveBannerData(reader.result, bgColor);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleColorChange = (e) => {
        const color = e.target.value;
        setBgColor(color);
        saveBannerData(bannerImage, color);
    };

    const saveBannerData = (image, color) => {
        const db = getDatabase();
        const bannerRef = ref(db, `users/${currentUser.uid}/banner`);
        set(bannerRef, { image, color });
    };

    return (
        <div className="banner-uploader">
            <h2>Customizar Banner</h2>
            <div
                className="banner-preview"
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
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            <input type="color" value={bgColor} onChange={handleColorChange} />
        </div>
    );
};

export default BannerUploader;
