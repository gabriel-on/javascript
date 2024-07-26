import React, { useState } from 'react';
import { ref as dbRef, set } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { database, storage } from '../../firebase/config';
import { useAuth } from '../../hooks/useAuthentication';

const PostFormArt = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [link, setLink] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [allowDownload, setAllowDownload] = useState(true);
    const { currentUser } = useAuth();

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (image && currentUser) {
            try {
                const imageRef = storageRef(storage, `images/${image.name}`);
                await uploadBytes(imageRef, image);
                const imageUrl = await getDownloadURL(imageRef);

                const postId = Date.now().toString();
                const timestamp = new Date().toISOString();

                await set(dbRef(database, 'posts/' + postId), {
                    userId: currentUser.uid,
                    title,
                    description,
                    link,
                    imageUrl,
                    allowDownload, // Adiciona a preferência de download
                    createdAt: timestamp
                });

                setTitle('');
                setDescription('');
                setLink('');
                setImage(null);
            } catch (error) {
                console.error('Erro ao criar post:', error);
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
            // Handle the case where image or currentUser is not available
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Título:</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div>
                <label>Descrição:</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
            </div>
            <div>
                <label>Link:</label>
                <input type="url" value={link} onChange={(e) => setLink(e.target.value)} />
            </div>
            <div>
                <label>Imagem:</label>
                <input type="file" onChange={handleImageChange} required />
            </div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={allowDownload}
                        onChange={(e) => setAllowDownload(e.target.checked)}
                    />
                    Permitir download da imagem
                </label>
            </div>
            <button type="submit" disabled={loading}>Postar</button>
        </form>
    );
};

export default PostFormArt;