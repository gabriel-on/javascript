import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../firebase/config';
import { useAuth } from '../../hooks/useAuthentication';

const LinkList = () => {
    const [links, setLinks] = useState([]);
    const { currentUser } = useAuth();

    useEffect(() => {
        const linksRef = ref(database, 'links');
        const unsubscribe = onValue(linksRef, (snapshot) => {
            const data = snapshot.val();
            const linkList = data
                ? Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }))
                : [];
            
            // Filtra os links para exibir apenas os do usuário autenticado, se currentUser não for null
            const userLinks = currentUser 
                ? linkList.filter(link => link.userId === currentUser.uid)
                : []; // Se currentUser for null, userLinks será um array vazio

            setLinks(userLinks);
        });

        // Cleanup function
        return () => unsubscribe();
    }, [currentUser]); // Adiciona currentUser como dependência

    return (
        <div>
            {/* Exibe o mentionName do usuário autenticado */}
            {currentUser && <h2>@{currentUser.mentionName}</h2>}
            <ul>
                {links.length > 0 ? (
                    links.map(link => (
                        <li key={link.id}>
                            <a href={link.url} target="_blank" rel="noopener noreferrer">{link.title}</a>
                        </li>
                    ))
                ) : (
                    <li>No links available.</li> // Mensagem caso não haja links
                )}
            </ul>
        </div>
    );
};

export default LinkList;
