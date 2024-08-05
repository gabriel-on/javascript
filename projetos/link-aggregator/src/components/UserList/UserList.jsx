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
            if (data) { // Verifica se os dados existem
                const userList = Object.keys(data).map(key => {
                    const userData = data[key];
                    return {
                        id: key,
                        displayName: userData.displayName,
                        mentionName: userData.mentionName,
                        profilePicture: userData.profilePicture?.image || '', // Acesso seguro com fallback
                    };
                });
                setUsers(userList);
            } else {
                setUsers([]); // Se não houver dados, define como uma lista vazia
            }
        });
    }, []);

    return (
        <div className="user-list-container">
            <h2>Usuários que usam o HIGHLINKS</h2>
            <ul>
                {users.map(user => (
                    <li key={user.id} className="user-item">
                        {user.profilePicture ? ( // Verifica se a imagem de perfil existe
                            <img
                                src={user.profilePicture}
                                alt={`${user.displayName}'s profile`}
                                className="profile-picture"
                            />
                        ) : (
                            <div className="placeholder-picture"></div> // Placeholder se não houver imagem
                        )}
                        <a href={`/${user.mentionName}`}>{user.displayName}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default UserList;
