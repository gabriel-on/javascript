import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../firebase/config';
import './UserList.css';

function UserList() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const usersRef = ref(database, 'users');
        onValue(usersRef, (snapshot) => {
            const data = snapshot.val();
            const userList = Object.keys(data).map(key => ({
                ...data[key],
                id: key,
                profilePicture: data[key].profilePicture.image // Ajustando para acessar a URL da imagem
            }));
            setUsers(userList);
        });
    }, []);

    return (
        <div className="user-list-container">
            <h2>Usuários que usam o HIGHLINKS</h2>
            <ul>
                {users.map(user => (
                    <li key={user.id} className="user-item">
                        <img src={user.profilePicture} alt={`${user.displayName}'s profile`} className="profile-picture" />
                        <a href={`/${user.mentionName}`}>{user.displayName}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default UserList;
