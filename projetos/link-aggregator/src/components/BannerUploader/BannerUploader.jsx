// src/components/BannerUploader/BannerUploader.jsx
import React, { useEffect, useState } from 'react';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { ref as dbRef, onValue, set as dbSet } from 'firebase/database';
import { storage, database } from '../../firebase/config'; // Certifique-se de exportar storage e database do seu config
import { useAuth } from '../../hooks/useAuthentication';
import './BannerUploader.css';

const BannerUploader = () => {
    const { currentUser } = useAuth();
    const [image, setImage] = useState(null);
    const [color, setColor] = useState('#ffffff');
    const [previewImage, setPreviewImage] = useState('');
    const [isTestingImage, setIsTestingImage] = useState(false);
    const [bannerData, setBannerData] = useState({ image: '', color: '#ffffff', imageUpdatedAt: null, colorUpdatedAt: null });

    useEffect(() => {
        if (currentUser) {
            const bannerRef = dbRef(database, `users/${currentUser.uid}/banner`);
            onValue(bannerRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    setBannerData(data);
                    setPreviewImage(data.image || '');
                    setColor(data.color || '#ffffff');
                }
            });
        }
    }, [currentUser]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
                setIsTestingImage(true); // Indica que está testando uma nova imagem
            };
            reader.readAsDataURL(file);
        }
    };

    const handleColorChange = (e) => {
        setColor(e.target.value);
        setIsTestingImage(false); // Indica que não está testando uma imagem
    };

    const handleSaveImage = async () => {
        if (currentUser && image) {
            const storageRef = ref(storage, `banners/${currentUser.uid}/${image.name}`);
            try {
                // Se já existe uma imagem, exclua a antiga
                if (bannerData.image) {
                    const oldImageRef = ref(storage, bannerData.image);
                    await deleteObject(oldImageRef);
                }

                // Fazer upload da nova imagem
                await uploadBytes(storageRef, image);
                const imageUrl = await getDownloadURL(storageRef);

                // Salvar a URL da imagem e a cor no banco de dados
                const bannerRef = dbRef(database, `users/${currentUser.uid}/banner`);
                await dbSet(bannerRef, {
                    image: imageUrl,
                    color,
                    imageUpdatedAt: new Date().toISOString(),
                    colorUpdatedAt: bannerData.colorUpdatedAt // Mantenha a data de atualização da cor
                });

                alert('Imagem do banner atualizada com sucesso!');
                setIsTestingImage(false); // Resetar estado após salvar
                setPreviewImage(''); // Limpar pré-visualização após salvar
            } catch (error) {
                console.error("Erro ao salvar a imagem do banner:", error);
                alert('Falha ao salvar a imagem do banner.');
            }
        }
    };

    const handleSaveColor = async () => {
        if (currentUser) {
            const bannerRef = dbRef(database, `users/${currentUser.uid}/banner`);
            try {
                await dbSet(bannerRef, {
                    image: bannerData.image,
                    color,
                    colorUpdatedAt: new Date().toISOString(),
                    imageUpdatedAt: bannerData.imageUpdatedAt // Mantenha a data de atualização da imagem
                });
                alert('Cor do banner atualizada com sucesso!');
                setIsTestingImage(false); // Resetar estado após salvar
                setPreviewImage(''); // Limpar pré-visualização após salvar
            } catch (error) {
                console.error("Erro ao salvar a cor do banner:", error);
                alert('Falha ao salvar a cor do banner.');
            }
        }
    };

    const displayBanner = () => {
        // Verifica se deve mostrar a imagem ou a cor
        if (isTestingImage) {
            return { backgroundImage: `url(${previewImage})`, backgroundColor: 'transparent' };
        } else if (bannerData.imageUpdatedAt && bannerData.colorUpdatedAt) {
            return new Date(bannerData.imageUpdatedAt) > new Date(bannerData.colorUpdatedAt)
                ? { backgroundImage: `url(${bannerData.image})`, backgroundColor: 'transparent' }
                : { backgroundImage: 'none', backgroundColor: bannerData.color };
        } else if (bannerData.imageUpdatedAt) {
            return { backgroundImage: `url(${bannerData.image})`, backgroundColor: 'transparent' };
        } else if (bannerData.colorUpdatedAt) {
            return { backgroundImage: 'none', backgroundColor: bannerData.color };
        }
        return { backgroundImage: 'none', backgroundColor: '#ffffff' };
    };

    return (
        <div className="banner-uploader">
            <h2>Atualizar Banner</h2>
            <div className="banner-preview" style={{
                ...displayBanner(),
                backgroundSize: 'cover',
                height: '150px',
                width: '100%',
                borderRadius: '8px',
                marginBottom: '10px',
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#fff',
                fontWeight: 'bold',
                textAlign: 'center',
                overflow: 'hidden',
            }}>
                {!previewImage && <p>Pré-visualização do banner</p>}
                {isTestingImage && previewImage && (
                    <div style={{
                        backgroundImage: `url(${previewImage})`,
                        backgroundSize: 'cover',
                        height: '150px',
                        width: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 1,
                        opacity: 0.6,
                    }} />
                )}
                {!isTestingImage && (
                    <div style={{
                        backgroundColor: color,
                        height: '150px',
                        width: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 0,
                    }} />
                )}
                <p style={{ zIndex: 2 }}>Cor: {color}</p>
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
            />
            <button onClick={handleSaveImage}>Salvar Imagem</button>
            <button onClick={handleSaveColor}>Salvar Cor</button>
        </div>
    );
};

export default BannerUploader;
