import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ref, onValue, get } from 'firebase/database';
import { database } from '../../firebase/config';

const UserProfile = () => {
    const { mentionName } = useParams();
    const [links, setLinks] = useState([]);
    const [userId, setUserId] = useState(null); // Estado para armazenar o ID do usuário

    useEffect(() => {
        // Função para obter o userId a partir do mentionName
        const fetchUserId = async () => {
            const usersRef = ref(database, 'users');
            onValue(usersRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    // Encontrar o userId com base no mentionName
                    for (const key in data) {
                        if (data[key].mentionName === mentionName) {
                            setUserId(key); // Armazena o userId correspondente
                            break;
                        }
                    }
                }
            });
        };

        fetchUserId();
    }, [mentionName]);

    useEffect(() => {
        if (userId) {
            const linksRef = ref(database, 'links');
            onValue(linksRef, (snapshot) => {
                const data = snapshot.val();
                const linkList = data
                    ? Object.keys(data).map(key => ({
                        id: key,
                        ...data[key]
                    }))
                    : [];

                // Filtra os links para exibir apenas os do usuário com base no userId
                const userLinks = linkList.filter(link => link.userId === userId);
                setLinks(userLinks);
            });
        }
    }, [userId]);

    return (
        <div>
            <h1>@{mentionName}</h1>
            <ul>
                {links.length > 0 ? (
                    links.map(link => (
                        <li key={link.id}>
                            <a href={link.url} target="_blank" rel="noopener noreferrer">{link.title}</a>
                        </li>
                    ))
                ) : (
                    <li>Nenhum link disponível para este usuário.</li>
                )}
            </ul>
        </div>
    );
};

export default UserProfile;
