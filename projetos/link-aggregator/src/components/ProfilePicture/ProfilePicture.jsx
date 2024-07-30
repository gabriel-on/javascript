// src/components/ProfilePicture/ProfilePicture.jsx
import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';

const ProfilePicture = ({ userId }) => {
    const [profileImage, setProfileImage] = useState('');

    useEffect(() => {
        if (userId) {
            const db = getDatabase();
            const userRef = ref(db, `users/${userId}/profileImage`);
            const unsubscribe = onValue(userRef, (snapshot) => {
                setProfileImage(snapshot.val());
            });

            // Limpeza do listener ao desmontar
            return () => unsubscribe();
        }
    }, [userId]);

    return (
        <div>
            {profileImage ? (
                <img src={profileImage} alt="Profile" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
            ) : (
                <p>No profile picture uploaded</p>
            )}
        </div>
    );
};

export default ProfilePicture;
