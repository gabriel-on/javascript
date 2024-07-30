// src/hooks/useLinks.js
import { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, push } from 'firebase/database';
import { getUnixTime } from 'date-fns';

const useLinks = (userId) => {
    const [links, setLinks] = useState([]);

    useEffect(() => {
        const database = getDatabase();
        const linksRef = ref(database, 'links');

        const unsubscribe = onValue(linksRef, (snapshot) => {
            const data = snapshot.val();
            const linkList = data
                ? Object.keys(data).map((key) => ({
                    id: key,
                    ...data[key],
                }))
                : [];
            setLinks(linkList);
        });

        return () => unsubscribe(); // Limpeza do listener quando o componente desmonta
    }, []);

    const addLink = (title, url) => {
        const newLink = {
            title,
            url,
            userId, // Armazenar o ID do usuário
            createdAt: getUnixTime(new Date()), // Armazenar a data de criação como timestamp UNIX
        };

        const database = getDatabase();
        const linksRef = ref(database, 'links');
        push(linksRef, newLink);
    };

    return { links, addLink };
};

export default useLinks;
