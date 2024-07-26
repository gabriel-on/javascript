// hooks/usePostForm.js
import { useState } from 'react';
import { ref as dbRef, set } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { database, storage } from '../firebase/config';
import { useAuth } from './useAuthentication';

const usePostForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [link, setLink] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [allowDownload, setAllowDownload] = useState(true);
    const [error, setError] = useState('');
    const [preview, setPreview] = useState(null);
    const { currentUser } = useAuth();

    const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        // Verifica se o arquivo é uma imagem e se não ultrapassa o tamanho máximo
        if (file && file.size <= MAX_IMAGE_SIZE) {
            setImage(file);
            setPreview(URL.createObjectURL(file)); // Cria uma pré-visualização da imagem
            setError('');
        } else if (file) {
            setError('O tamanho da imagem deve ser menor que 2MB.');
            setImage(null);
        }
    };

    const compressImage = (file) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Redimensiona a imagem
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

                // Converte o canvas para um arquivo de imagem
                canvas.toBlob((blob) => {
                    resolve(blob);
                }, 'image/jpeg', 0.8); // Qualidade JPEG
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (image && currentUser) {
            try {
                const compressedImage = await compressImage(image); // Comprime a imagem

                // Gera um nome de arquivo baseado no título, removendo caracteres inválidos
                const sanitizedTitle = title.replace(/[<>:"/\\|?*]+/g, ''); // Remove caracteres inválidos
                const imageRef = storageRef(storage, `images/${sanitizedTitle}-${Date.now()}.jpg`); // Adiciona timestamp para evitar conflitos de nomes

                await uploadBytes(imageRef, compressedImage);
                const imageUrl = await getDownloadURL(imageRef);

                const postId = Date.now().toString();
                const timestamp = new Date().toISOString();

                await set(dbRef(database, 'posts/' + postId), {
                    userId: currentUser.uid,
                    title,
                    description,
                    link,
                    imageUrl,
                    allowDownload,
                    createdAt: timestamp
                });

                // Limpa o estado do formulário após o envio
                setTitle('');
                setDescription('');
                setLink('');
                setImage(null);
                setPreview(null); // Limpa a pré-visualização
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

    return {
        title,
        setTitle,
        description,
        setDescription,
        link,
        setLink,
        image,
        handleImageChange,
        loading,
        setLoading,
        allowDownload,
        setAllowDownload,
        error,
        preview,
        handleSubmit
    };
};

export default usePostForm;
