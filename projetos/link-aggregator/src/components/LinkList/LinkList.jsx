// src/components/LinkList/LinkList.js
import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../firebase/config';
import { useAuth } from '../../hooks/useAuthentication';

const LinkList = () => {
    const [links, setLinks] = useState([]);
    const { currentUser } = useAuth();

    useEffect(() => {
        const linksRef = ref(database, 'links');
        onValue(linksRef, (snapshot) => {
            const data = snapshot.val();
            const linkList = data ? Object.keys(data).map(key => ({
                id: key,
                ...data[key]
            })) : [];
            setLinks(linkList);
        });
    }, []);

    return (
        <div>
            {/* Exibe o mentionName do usuário autenticado */}
            {currentUser && <h2>@{currentUser.mentionName}</h2>}
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

export default LinkList;
