import React, { createContext, useContext, useState } from 'react';

// Cria um contexto para as análises
const ReviewsContext = createContext();

// Provedor do contexto
export const ReviewsProvider = ({ children }) => {
    const [reviews, setReviews] = useState([]);

    const addReview = (newReview) => {
        setReviews((prevReviews) => [...prevReviews, newReview]);
    };

    return (
        <ReviewsContext.Provider value={{ reviews, addReview }}>
            {children}
        </ReviewsContext.Provider>
    );
};

// Hook para consumir o contexto
export const useReviews = () => {
    const context = useContext(ReviewsContext);
    if (!context) {
        throw new Error('useReviews deve ser utilizado dentro de um ReviewsProvider');
    }
    return context;
};
