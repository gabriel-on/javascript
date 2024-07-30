// src/components/BannerUploader/BannerUploader.jsx
import React, { useState } from 'react';
import { ref, set } from 'firebase/database';
import { database } from '../../firebase/config';
import { useAuth } from '../../hooks/useAuthentication';
import './BannerUploader.css';

const BannerUploader = () => {
    const { currentUser } = useAuth();
    const [image, setImage] = useState('');
    const [color, setColor] = useState('#ffffff');
    const [previewImage, setPreviewImage] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (currentUser) {
            const bannerRef = ref(database, `users/${currentUser.uid}/banner`);
            try {
                await set(bannerRef, { image: previewImage, color });
                alert('Banner atualizado com sucesso!');
            } catch (error) {
                console.error("Erro ao salvar o banner:", error);
            }
        }
    };

    return (
        <div className="banner-uploader">
            <h2>Atualizar Banner</h2>
            <div className="banner-preview" style={{ backgroundColor: color, backgroundImage: `url(${previewImage})`, backgroundSize: 'cover', height: '150px', width: '100%', borderRadius: '8px', marginBottom: '10px' }}>
                {!previewImage && <p>Pré-visualização do banner</p>}
            </div>
            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
            />
            <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
            />
            <button onClick={handleSave}>Salvar</button>
        </div>
    );
};

export default BannerUploader;
