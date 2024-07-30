import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { database } from '../../firebase/config';

const UserProfile = () => {
    const { mentionName } = useParams();
    const [links, setLinks] = useState([]);

    useEffect(() => {
        const linksRef = ref(database, 'links');
        onValue(linksRef, (snapshot) => {
            const data = snapshot.val();
            const linkList = data
                ? Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }))
                : [];

            // Filtra os links para exibir apenas os do usuário com base no mentionName
            const userLinks = linkList.filter(link => link.userId === mentionName);
            setLinks(userLinks);
        });
    }, [mentionName]);

    return (
        <div>
            <h1>User Profile for @{mentionName}</h1>
            <ul>
                {links.map(link => (
                    <li key={link.id}>
                        <a href={link.url} target="_blank" rel="noopener noreferrer">{link.title}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserProfile;
