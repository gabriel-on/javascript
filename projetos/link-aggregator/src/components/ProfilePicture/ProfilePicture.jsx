import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';

const ProfilePicture = ({ userId }) => {
    const [profileImage, setProfileImage] = useState('');

    useEffect(() => {
        if (userId) {
            const db = getDatabase();
            const userRef = ref(db, `users/${userId}/profilePicture`);
            const unsubscribe = onValue(userRef, (snapshot) => {
                const data = snapshot.val();
                if (data && data.image) {
                    setProfileImage(data.image);
                } else {
                    setProfileImage('');
                }
            });

            // Limpeza do listener ao desmontar
            return () => unsubscribe();
        }
    }, [userId]);

    return (
        <div className='profile-img'>
            {profileImage ? (
                <img src={profileImage} alt="Profile" />
            ) : (
                <p>No profile picture uploaded</p>
            )}
        </div>
    );
};

export default ProfilePicture;
