import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../firebase/config';
import './UserCarousel.css';

function UserCarousel() {
    const [users, setUsers] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const usersRef = ref(database, 'users');
        onValue(usersRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const userList = Object.keys(data).map(key => ({
                    id: key,
                    displayName: data[key].displayName,
                    mentionName: data[key].mentionName,
                    profilePicture: data[key].profilePicture?.image || '',
                }));

                // Embaralha a lista de usuários
                const shuffledUserList = userList.sort(() => Math.random() - 0.5);
                setUsers(shuffledUserList);
            } else {
                setUsers([]);
            }
        });
    }, []);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % users.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + users.length) % users.length);
    };

    return (
        <div className="carousel-container">
            <h2>Usuários em Destaque</h2>
            {users.length > 0 && (
                <div className="user-card">
                    <div className="user-item">
                        {users[currentIndex].profilePicture ? (
                            <img
                                src={users[currentIndex].profilePicture}
                                alt={`${users[currentIndex].displayName}'s profile`}
                                className="profile-picture"
                            />
                        ) : (
                            <div className="placeholder-picture"></div>
                        )}
                        <a href={`/${users[currentIndex].mentionName}`}>
                            {users[currentIndex].displayName}
                        </a>
                    </div>
                </div>
            )}
            <div className="carousel-controls">
                <button onClick={handlePrev} disabled={users.length === 0}>❮</button>
                <button onClick={handleNext} disabled={users.length === 0}>❯</button>
            </div>
        </div>
    );
}

export default UserCarousel;
