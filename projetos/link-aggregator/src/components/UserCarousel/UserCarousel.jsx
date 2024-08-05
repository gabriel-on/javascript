import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../firebase/config';
import './UserSwiper.css';

function UserSwiper() {
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
                setUsers(userList);
            }
        });
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % users.length);
        }, 3000); // Altere o tempo para a rotação automática

        return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
    }, [users]);

    const handlePrev = () => {
        setCurrentIndex(prevIndex => (prevIndex - 1 + users.length) % users.length);
    };

    const handleNext = () => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % users.length);
    };

    if (users.length === 0) {
        return <p>Carregando usuários...</p>;
    }

    return (
        <div className="swiper-container">
            <button className="swiper-button prev" onClick={handlePrev}>❮</button>
            <div className="swiper-slide">
                <img
                    src={users[currentIndex].profilePicture}
                    alt={`${users[currentIndex].displayName}'s profile`}
                    className="profile-picture"
                />
                <p>{users[currentIndex].displayName}</p>
                <a href={`/${users[currentIndex].mentionName}`}>{users[currentIndex].mentionName}</a>
            </div>
            <button className="swiper-button next" onClick={handleNext}>❯</button>
        </div>
    );
}

export default UserSwiper;
