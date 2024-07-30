// src/components/BannerUploader/BannerUploader.jsx
import React, { useEffect, useState } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { database } from '../../firebase/config';
import { useAuth } from '../../hooks/useAuthentication';
import './BannerUploader.css';

const BannerUploader = () => {
    const { currentUser } = useAuth();
    const [image, setImage] = useState('');
    const [color, setColor] = useState('#ffffff');
    const [previewImage, setPreviewImage] = useState('');
    const [testingColor, setTestingColor] = useState(false); // Novo estado

    useEffect(() => {
        if (currentUser) {
            const bannerRef = ref(database, `users/${currentUser.uid}/banner`);
            onValue(bannerRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    setPreviewImage(data.image || '');
                    setColor(data.color || '#ffffff');
                }
            });
        }
    }, [currentUser]);

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

    const handleColorChange = (e) => {
        setColor(e.target.value);
        setTestingColor(true); // Define que o usuário está testando a cor
    };

    const handleSave = async () => {
        if (currentUser) {
            const bannerRef = ref(database, `users/${currentUser.uid}/banner`);
            try {
                await set(bannerRef, { image: previewImage, color });
                alert('Banner atualizado com sucesso!');
                setTestingColor(false); // Redefine para falso ao salvar
            } catch (error) {
                console.error("Erro ao salvar o banner:", error);
            }
        }
    };

    return (
        <div className="banner-uploader">
            <h2>Atualizar Banner</h2>
            <div className="banner-preview" style={{ backgroundColor: color, backgroundImage: testingColor ? 'none' : `url(${previewImage})`, backgroundSize: 'cover', height: '150px', width: '100%', borderRadius: '8px', marginBottom: '10px' }}>
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
                onChange={handleColorChange}
                onBlur={() => setTestingColor(false)} // Volta a mostrar a imagem quando termina de testar a cor
            />
            <button onClick={handleSave}>Salvar</button>
        </div>
    );
};

export default BannerUploader;
