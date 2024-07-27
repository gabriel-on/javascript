import { useState } from 'react';
import { ref as dbRef, set } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { database, storage } from '../firebase/config';
import { useAuth } from './useAuthentication';

const usePostForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [link, setLink] = useState('');
    const [images, setImages] = useState([]); // Agora um array para várias imagens
    const [loading, setLoading] = useState(false);
    const [allowDownload, setAllowDownload] = useState(true);
    const [error, setError] = useState('');
    const [previews, setPreviews] = useState([]); // Agora um array para pré-visualizações
    const { currentUser } = useAuth();

    const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const validImages = [];
        const validPreviews = [];

        files.forEach(file => {
            if (file.size <= MAX_IMAGE_SIZE) {
                validImages.push(file);
                validPreviews.push(URL.createObjectURL(file)); // Cria pré-visualização
            } else {
                setError('O tamanho da imagem deve ser menor que 2MB.');
            }
        });

        setImages(validImages);
        setPreviews(validPreviews);
        setError('');
    };

    const compressImage = (file) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                const MAX_WIDTH = 1920;
                const MAX_HEIGHT = 1080;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    resolve(blob);
                }, 'image/jpeg', 0.8);
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (images.length > 0 && currentUser) {
            try {
                const uploadedImages = await Promise.all(images.map(async (image) => {
                    const compressedImage = await compressImage(image);

                    const sanitizedTitle = title.replace(/[<>:"/\\|?*]+/g, '');
                    const imageRef = storageRef(storage, `images/${sanitizedTitle}-${Date.now()}.jpg`);

                    await uploadBytes(imageRef, compressedImage);
                    return await getDownloadURL(imageRef);
                }));

                const postId = Date.now().toString();
                const timestamp = new Date().toISOString();

                await set(dbRef(database, 'posts/' + postId), {
                    userId: currentUser.uid,
                    title,
                    description,
                    link,
                    imageUrls: uploadedImages, // Agora um array de URLs
                    allowDownload,
                    createdAt: timestamp
                });

                setTitle('');
                setDescription('');
                setLink('');
                setImages([]); // Limpa o estado das imagens
                setPreviews([]); // Limpa as pré-visualizações
            } catch (error) {
                console.error('Erro ao criar post:', error);
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    };

    return {
        title,
        setTitle,
        description,
        setDescription,
        link,
        setLink,
        images,
        handleImageChange,
        loading,
        setLoading,
        allowDownload,
        setAllowDownload,
        error,
        previews,
        handleSubmit
    };
};

export default usePostForm;
