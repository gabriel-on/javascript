import React, { useEffect, useState, useRef } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../firebase/config';
import './UserList.css';

function UserList() {
    const [users, setUsers] = useState([]);
    const sliderRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const slideInterval = useRef(null);

    useEffect(() => {
        const usersRef = ref(database, 'users');
        onValue(usersRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const userList = Object.keys(data).map(key => {
                    const userData = data[key];
                    return {
                        id: key,
                        displayName: userData.displayName,
                        mentionName: userData.mentionName,
                        profilePicture: userData.profilePicture?.image || '',
                    };
                });
                setUsers(userList);
            } else {
                setUsers([]);
            }
        });
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % users.length);
        }, 3000); // Altere o intervalo para o tempo desejado em milissegundos
        slideInterval.current = interval;

        return () => clearInterval(interval);
    }, [users.length]);

    const handlePrev = () => {
        setCurrentIndex(prevIndex => (prevIndex - 1 + users.length) % users.length);
    };

    const handleNext = () => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % users.length);
    };

    return (
        <div className="user-list-container">
            <h2>Usuários que usam o HIGHLINKS</h2>
            <div className="carousel">
                <button className="prev" onClick={handlePrev}>❮</button>
                <div className="carousel-inner" ref={sliderRef}>
                    <ul className="carousel-list" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                        {users.map(user => (
                            <li key={user.id} className="user-item">
                                {user.profilePicture ? (
                                    <img
                                        src={user.profilePicture}
                                        alt={`${user.displayName}'s profile`}
                                        className="profile-picture"
                                    />
                                ) : (
                                    <div className="placeholder-picture"></div>
                                )}
                                <a href={`/${user.mentionName}`}>{user.displayName}</a>
                            </li>
                        ))}
                    </ul>
                </div>
                <button className="next" onClick={handleNext}>❯</button>
            </div>
        </div>
    );
}

export default UserList;
