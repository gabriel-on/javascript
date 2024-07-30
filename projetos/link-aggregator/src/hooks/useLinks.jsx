import { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, push, update, remove } from 'firebase/database';
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

        return () => unsubscribe();
    }, []);

    const addLink = (title, url) => {
        const newLink = {
            title,
            url,
            userId,
            createdAt: getUnixTime(new Date()),
        };

        const database = getDatabase();
        const linksRef = ref(database, 'links');
        push(linksRef, newLink);
    };

    const editLink = (id, newTitle, newUrl) => {
        const database = getDatabase();
        const linkRef = ref(database, `links/${id}`);
        update(linkRef, { title: newTitle, url: newUrl });
    };

    const deleteLink = (id) => {
        const database = getDatabase();
        const linkRef = ref(database, `links/${id}`);
        remove(linkRef);
    };

    return { links, addLink, editLink, deleteLink };
};

export default useLinks;
