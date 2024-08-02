// src/hooks/useBanner.js
import { useState, useEffect } from 'react';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { ref as dbRef, onValue, set as dbSet } from 'firebase/database';
import { storage, database } from '../firebase/config';
import { useAuth } from './useAuthentication';

const useBanner = () => {
    const { currentUser } = useAuth();
    const [image, setImage] = useState(null);
    const [bannerData, setBannerData] = useState({ image: '', imageUpdatedAt: null });

    useEffect(() => {
        if (currentUser) {
            const bannerRef = dbRef(database, `users/${currentUser.uid}/banner`);
            onValue(bannerRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    setBannerData(data);
                }
            });
        }
    }, [currentUser]);

    const handleSaveImage = async (croppedImage) => { // Aceitando a imagem recortada como argumento
        if (currentUser && croppedImage) {
            const blob = await fetch(croppedImage).then(res => res.blob()); // Convertendo a imagem recortada em Blob
            const storageRef = ref(storage, `banners/${currentUser.uid}/${Date.now()}.png`);
            try {
                if (bannerData.image) {
                    const oldImageRef = ref(storage, bannerData.image);
                    await deleteObject(oldImageRef);
                }
                await uploadBytes(storageRef, blob);
                const imageUrl = await getDownloadURL(storageRef);
                const bannerRef = dbRef(database, `users/${currentUser.uid}/banner`);
                await dbSet(bannerRef, {
                    image: imageUrl,
                    imageUpdatedAt: new Date().toISOString(),
                });

                alert('Imagem do banner atualizada com sucesso!');
            } catch (error) {
                console.error("Erro ao salvar a imagem do banner:", error);
                alert('Falha ao salvar a imagem do banner.');
            }
        }
    };

    return {
        bannerData,
        handleSaveImage // Retornando a função para salvar a imagem
    };
};

export default useBanner;
