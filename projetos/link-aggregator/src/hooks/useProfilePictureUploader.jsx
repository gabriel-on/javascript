import { useState, useEffect } from 'react';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { ref as dbRef, onValue, set as dbSet } from 'firebase/database';
import { storage, database } from '../firebase/config';
import { useAuth } from './useAuthentication';

const useProfilePictureUploader = () => {
    const { currentUser } = useAuth();
    const [profileData, setProfileData] = useState({ image: '', imageUpdatedAt: null });

    useEffect(() => {
        if (currentUser) {
            const profileRef = dbRef(database, `users/${currentUser.uid}/profilePicture`);
            onValue(profileRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    setProfileData(data);
                }
            });
        }
    }, [currentUser]);

    const handleSaveImage = async (croppedImage) => {
        if (currentUser && croppedImage) {
            const blob = await fetch(croppedImage).then(res => res.blob());
            const storageRef = ref(storage, `profile_pictures/${currentUser.uid}/${Date.now()}.png`);
            try {
                if (profileData.image) {
                    const oldImageRef = ref(storage, profileData.image);
                    await deleteObject(oldImageRef);
                }
                await uploadBytes(storageRef, blob);
                const imageUrl = await getDownloadURL(storageRef);
                const profileRef = dbRef(database, `users/${currentUser.uid}/profilePicture`);
                await dbSet(profileRef, {
                    image: imageUrl,
                    imageUpdatedAt: new Date().toISOString(),
                });

                alert('Imagem de perfil atualizada com sucesso!');
            } catch (error) {
                console.error("Erro ao salvar a imagem de perfil:", error);
                alert('Falha ao salvar a imagem de perfil.');
            }
        }
    };

    return {
        profileData,
        handleSaveImage
    };
};

export default useProfilePictureUploader;
