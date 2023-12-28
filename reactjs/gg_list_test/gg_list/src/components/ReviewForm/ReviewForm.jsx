import React, { useState } from 'react';
import api from '../../axios/config';

const ReviewForm = ({ id, onSave, setGame }) => {
    const [newReview, setNewReview] = useState('');

    const handleSaveReview = async () => {
        try {
            // Verifica se o campo da análise está vazio
            if (!newReview.trim()) {
                console.warn('O campo de análise está vazio. Não é possível salvar.');
                return;
            }

            const response = await api.post(`/posts/${id}/reviews`, { review: newReview });

            // Normaliza a estrutura da análise
            const normalizedReview = response.data.review ? response.data.review : { review: response.data };

            // Atualiza o estado incluindo a nova análise na lista
            setGame((prevGame) => {
                const reviews = Array.isArray(prevGame.reviews)
                    ? [...prevGame.reviews, normalizedReview]
                    : [normalizedReview];

                return {
                    ...prevGame,
                    reviews: reviews,
                };
            });

            // Chama a função onSave se existir
            onSave && onSave(normalizedReview);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <label>Nova Análise:</label>
            <textarea
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
            ></textarea>
            <button onClick={handleSaveReview}>Enviar</button>
        </div>
    );
};

export default ReviewForm;