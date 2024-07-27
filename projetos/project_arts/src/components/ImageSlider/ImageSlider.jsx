import React, { useState } from 'react';
import './ImageSlider.css';

const ImageSlider = ({ images, onImageClick }) => {
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
            <div className='slider-button-container'>
                <div className='slider-button'>
                    <button onClick={handlePrevious} className="btn-1">Anterior</button>
                    <button onClick={handleNext} className="btn-2">Próxima</button>
                </div>
                <img
                    src={images[currentIndex]}
                    alt={`Imagem ${currentIndex + 1}`}
                    className="slider-image"
                    onClick={() => onImageClick(images[currentIndex])} // Chama a função ao clicar na imagem
                />
            </div>
        </div>
    );
};

export default ImageSlider;
