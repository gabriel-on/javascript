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
        startSlideInterval(); // Inicia o intervalo assim que os usuários forem definidos

        return () => clearInterval(slideInterval.current); // Limpa o intervalo ao desmontar
    }, [users]);

    const startSlideInterval = () => {
        const interval = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % users.length);
        }, 3000); // Intervalo de 3 segundos
        slideInterval.current = interval;
    };

    const handlePrev = () => {
        setCurrentIndex(prevIndex => (prevIndex - 1 + users.length) % users.length);
    };

    const handleNext = () => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % users.length);
    };

    const handleMouseEnter = () => {
        clearInterval(slideInterval.current); // Para a rotação ao passar o mouse
    };

    const handleMouseLeave = () => {
        startSlideInterval(); // Retoma a rotação ao sair do mouse
    };

    return (
        <div className="user-list-container">
            <h2>Usuários que usam o HIGHLINKS</h2>
            <div className="carousel" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
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
