import React, { useState } from 'react';
import './ImageSlider.css';

const ImageSlider = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    const handleThumbnailClick = (index) => {
        setCurrentIndex(index);
    };

    return (
        <div className="image-slider">
            <button onClick={handlePrevious} className="slider-button">Anterior</button>
            <img
                src={images[currentIndex]}
                alt={`Imagem ${currentIndex + 1}`}
                className="slider-image"
            />
            <button onClick={handleNext} className="slider-button">Próxima</button>
            <div className="thumbnails">
                {images.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        alt={`Miniatura ${index + 1}`}
                        className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => handleThumbnailClick(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ImageSlider;
