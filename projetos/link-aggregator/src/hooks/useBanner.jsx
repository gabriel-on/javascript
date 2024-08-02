// src/hooks/useBanner.js
import { useState, useEffect } from 'react';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { ref as dbRef, onValue, set as dbSet } from 'firebase/database';
import { storage, database } from '../firebase/config';
import { useAuth } from './useAuthentication';

const useBanner = () => {
    const { currentUser } = useAuth();
    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState('');
    const [isTestingImage, setIsTestingImage] = useState(false);
    const [bannerData, setBannerData] = useState({ image: '', imageUpdatedAt: null });

    useEffect(() => {
        if (currentUser) {
            const bannerRef = dbRef(database, `users/${currentUser.uid}/banner`);
            onValue(bannerRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    console.log('Banner data fetched:', data);
                    setBannerData(data);
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
                    imageUpdatedAt: new Date().toISOString(),
                });

                alert('Imagem do banner atualizada com sucesso!');
                setIsTestingImage(false);
                setPreviewImage('');
            } catch (error) {
                console.error("Erro ao salvar a imagem do banner:", error);
                alert('Falha ao salvar a imagem do banner.');
            }
        }
    };

    return {
        bannerData,
        previewImage,
        isTestingImage,
        handleImageChange,
        handleSaveImage
    };
};

export default useBanner;
