import React, { useState } from 'react';
import useBanner from '../../hooks/useBanner';
import './BannerUploader.css';
import ImageCropperModal from '../ImageCropperModal/ImageCropperModal';

const BannerUploader = () => {
    const { bannerData, handleSaveImage } = useBanner();
    const [showCropper, setShowCropper] = useState(false);
    const [imageToCrop, setImageToCrop] = useState('');
    const [previewImage, setPreviewImage] = useState('');

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageToCrop(reader.result);
                setShowCropper(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCrop = (croppedImage) => {
        setShowCropper(false);
        setPreviewImage(croppedImage);
    };

    const saveCroppedImage = () => {
        handleSaveImage(previewImage);
    };

    const displayBanner = () => {
        const imageUpdated = new Date(bannerData.imageUpdatedAt);
        if (previewImage) {
            return { backgroundImage: `url(${previewImage})`, backgroundColor: 'transparent' };
        } else if (bannerData.image && imageUpdated) {
            return { backgroundImage: `url(${bannerData.image})`, backgroundColor: 'transparent' };
        } else {
            return { backgroundImage: 'none', backgroundColor: 'transparent' };
        }
    };

    return (
        <div className="banner-uploader">
            <h2>Atualizar Banner</h2>
            <div className="banner-preview" style={displayBanner()}>
                {previewImage && (
                    <img
                        src={previewImage}
                        alt="Preview"
                        style={{
                            width: '100%',
                            height: '200px',
                            borderRadius: '8px',
                            position: 'relative',
                            top: 0,
                            left: 0,
                            objectFit: 'cover'
                        }}
                    />
                )}
            </div>
            <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
            />
            <button onClick={saveCroppedImage}>Salvar Imagem</button>

            {showCropper && (
                <ImageCropperModal
                    image={imageToCrop}
                    onCrop={handleCrop}
                    onClose={() => setShowCropper(false)}
                />
            )}
        </div>
    );
};

export default BannerUploader;
