import React, { useEffect, useState } from "react";
import { storage } from "../../firebase/config";
import { ref, listAll, getDownloadURL } from "firebase/storage";

const MusicList = () => {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const musicRef = ref(storage, "musics_beats");
                const musicList = await listAll(musicRef);
                const urls = await Promise.all(
                    musicList.items.map(async (item) => {
                        const url = await getDownloadURL(item);
                        return { name: item.name, url };
                    })
                );

                setSongs(urls);
                setLoading(false);
            } catch (error) {
                console.error("Erro ao carregar músicas:", error);
            }
        };

        fetchSongs();
    }, []);

    if (loading) return <p>Carregando músicas...</p>;

    return (
        <div>
            <h1>Lista de Músicas</h1>
            <ul>
                {songs.map((song, index) => (
                    <li key={index}>
                        <span>{song.name}</span>
                        <a href={song.url} target="_blank" rel="noopener noreferrer" download>
                            Baixar
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MusicList;
