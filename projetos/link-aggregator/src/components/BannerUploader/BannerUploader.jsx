import React, { useState } from 'react';
import useBanner from '../../hooks/useBanner';
import './BannerUploader.css';

const BannerUploader = () => {
    const {
        bannerData,
        previewImage,
        isTestingImage,
        handleImageChange,
        handleSaveImage
    } = useBanner();

    const displayBanner = () => {
        const imageUpdated = new Date(bannerData.imageUpdatedAt);

        console.log('Image updated at:', imageUpdated);

        if (isTestingImage && previewImage) {
            return { backgroundImage: `url(${previewImage})`, backgroundColor: 'transparent' };
        } else if (bannerData.image && imageUpdated) {
            console.log('Displaying image:', bannerData.image);
            return { backgroundImage: `url(${bannerData.image})`, backgroundColor: 'transparent' };
        } else {
            console.log('No image to display');
            return { backgroundImage: 'none', backgroundColor: 'transparent' }; // ou uma cor padrão
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
                {!isTestingImage && bannerData.image && (
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
                        height: '150px',
                        width: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 0,
                    }} />
                )}
            </div>
            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
            />
            <button onClick={handleSaveImage}>Salvar Imagem</button>
        </div>
    );
};

export default BannerUploader;
