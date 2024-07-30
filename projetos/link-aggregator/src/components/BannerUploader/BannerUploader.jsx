// src/components/BannerUploader/BannerUploader.jsx
import React, { useState } from 'react';
import useBanner from '../../hooks/useBanner';
import './BannerUploader.css';

const BannerUploader = () => {
    const {
        bannerData,
        color,
        previewImage,
        isTestingImage,
        handleImageChange,
        handleColorChange,
        handleSaveImage,
        handleSaveColor
    } = useBanner();
    const [isTestingColor, setIsTestingColor] = useState(false);

    const displayBanner = () => {
        const imageUpdated = new Date(bannerData.imageUpdatedAt);
        const colorUpdated = new Date(bannerData.colorUpdatedAt);

        console.log('Image updated at:', imageUpdated);
        console.log('Color updated at:', colorUpdated);

        if (isTestingImage && previewImage) {
            return { backgroundImage: `url(${previewImage})`, backgroundColor: 'transparent' };
        } else if (isTestingColor) {
            return { backgroundImage: 'none', backgroundColor: color };
        } else if (imageUpdated >= colorUpdated && bannerData.image) {
            console.log('Displaying image:', bannerData.image);
            return { backgroundImage: `url(${bannerData.image})`, backgroundColor: 'transparent' };
        } else {
            console.log('Displaying color:', color);
            return { backgroundImage: 'none', backgroundColor: color };
        }
    };

    return (
        <div className="banner-uploader">
            <h2>Atualizar Banner</h2>
            <div className="banner-preview" style={{
                ...displayBanner(),
                backgroundSize: 'cover',
                height: '150px',
                width: '100%',
                borderRadius: '8px',
                marginBottom: '10px',
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#fff',
                fontWeight: 'bold',
                textAlign: 'center',
                overflow: 'hidden',
            }}>
                {isTestingImage && previewImage && (
                    <img
                        src={previewImage}
                        alt="Preview"
                        style={{
                            width: '100%',
                            height: '150px',
                            borderRadius: '8px',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            zIndex: 2,
                            objectFit: 'cover'
                        }}
                    />
                )}
                {!isTestingImage && bannerData.image && new Date(bannerData.imageUpdatedAt) >= new Date(bannerData.colorUpdatedAt) && (
                    <img
                        src={bannerData.image}
                        alt="Banner"
                        style={{
                            width: '100%',
                            height: '150px',
                            borderRadius: '8px',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            zIndex: 1,
                            objectFit: 'cover'
                        }}
                    />
                )}
                {!isTestingImage && !bannerData.image && (
                    <div style={{
                        backgroundColor: color,
                        height: '150px',
                        width: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 0,
                    }} />
                )}
                <p style={{ zIndex: 3 }}>Cor: {color}</p>
            </div>
            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
            />
            <input
                type="color"
                value={color}
                onChange={handleColorChange}
                onFocus={() => setIsTestingColor(true)}
                onBlur={() => setIsTestingColor(false)}
            />
            <button onClick={handleSaveImage}>Salvar Imagem</button>
            <button onClick={handleSaveColor}>Salvar Cor</button>
        </div>
    );
};

export default BannerUploader;
