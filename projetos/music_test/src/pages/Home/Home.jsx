import React, { useEffect, useState } from "react";
import { storage } from "../../firebase/config"; // Ajuste o caminho para o seu arquivo de configuração do Firebase
import { ref, listAll, getDownloadURL } from "firebase/storage";

const Home = () => {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const musicRef = ref(storage, "musics_beats/"); // A pasta onde suas músicas estão
                const musicList = await listAll(musicRef);

                const urls = await Promise.all(
                    musicList.items.slice(0, 5).map(async (item) => {
                        const url = await getDownloadURL(item); // Obter a URL do arquivo
                        console.log("URL gerada:", url); // Verifique a URL gerada
                        return { name: item.name, url };
                    })
                );
                setSongs(urls);
                setLoading(false);
            } catch (error) {
                console.error("Erro ao carregar músicas:", error);
                setLoading(false);
            }
        };
        fetchSongs();
    }, []);

    const handleDownload = async (url, name) => {
        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Falha ao buscar o arquivo');
            }

            const blob = await response.blob();  // Obtém o arquivo como um Blob

            // Cria um link temporário para download
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = name;

            // Dispara o download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Erro ao buscar o arquivo:", error);
        }
    };


    if (loading) return <p>Carregando músicas...</p>;

    return (
        <div>
            <h1>Bem-vindo ao nosso site de Músicas!</h1>
            <h2>Algumas músicas recentes</h2>
            <ul>
                {songs.map((song, index) => (
                    <li key={index}>
                        <span>{song.name}</span>
                        <a href={song.url} target="_blank" rel="noopener noreferrer" download={song.name}>
                            Baixar
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Home;
