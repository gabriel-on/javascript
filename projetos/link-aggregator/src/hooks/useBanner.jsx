// src/hooks/useBanner.js
import { useState, useEffect } from 'react';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { ref as dbRef, onValue, set as dbSet } from 'firebase/database';
import { storage, database } from '../firebase/config';
import { useAuth } from './useAuthentication';

const useBanner = () => {
    const { currentUser } = useAuth();
    const [bannerData, setBannerData] = useState({ image: '', color: '#ffffff', imageUpdatedAt: '', colorUpdatedAt: '' });
    const [image, setImage] = useState(null);
    const [color, setColor] = useState('#ffffff');
    const [previewImage, setPreviewImage] = useState('');
    const [isTestingImage, setIsTestingImage] = useState(false);

    useEffect(() => {
        if (currentUser) {
            const bannerRef = dbRef(database, `users/${currentUser.uid}/banner`);
            onValue(bannerRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    console.log('Banner data fetched:', data); // Log para depuração
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
                setIsTestingImage(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleColorChange = (e) => {
        setColor(e.target.value);
        setIsTestingImage(false);
    };

    const handleSaveImage = async () => {
        if (currentUser && image) {
            const storageRef = ref(storage, `banners/${currentUser.uid}/${image.name}`);
            try {
                if (bannerData.image) {
                    const oldImageRef = ref(storage, bannerData.image);
                    await deleteObject(oldImageRef);
                }

                await uploadBytes(storageRef, image);
                const imageUrl = await getDownloadURL(storageRef);

                const bannerRef = dbRef(database, `users/${currentUser.uid}/banner`);
                await dbSet(bannerRef, {
                    image: imageUrl,
                    color,
                    imageUpdatedAt: new Date().toISOString(),
                    colorUpdatedAt: bannerData.colorUpdatedAt || '',
                });

                console.log('Image URL after save:', imageUrl); // Log para depuração
                setBannerData(prev => ({
                    ...prev,
                    image: imageUrl,
                    imageUpdatedAt: new Date().toISOString(),
                }));
                setIsTestingImage(false);
                setPreviewImage('');
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
                    image: bannerData.image || '',
                    color,
                    colorUpdatedAt: new Date().toISOString(),
                    imageUpdatedAt: bannerData.imageUpdatedAt || '',
                });

                setBannerData(prev => ({
                    ...prev,
                    color,
                    colorUpdatedAt: new Date().toISOString(),
                }));
                setIsTestingImage(false);
                setPreviewImage('');
            } catch (error) {
                console.error("Erro ao salvar a cor do banner:", error);
                alert('Falha ao salvar a cor do banner.');
            }
        }
    };

    return {
        bannerData,
        image,
        color,
        previewImage,
        isTestingImage,
        handleImageChange,
        handleColorChange,
        handleSaveImage,
        handleSaveColor
    };
};

export default useBanner;
