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
            const fileSizeInKB = file.size / 1024; // Tamanho em KB
            const maxSizeInKB = 500; // Limite máximo de tamanho em KB

            if (fileSizeInKB > maxSizeInKB) {
                alert(`O arquivo deve ter no máximo ${maxSizeInKB} KB. Você enviou ${fileSizeInKB.toFixed(2)} KB.`);
                return;
            }

            const img = new Image();
            const reader = new FileReader();
            reader.onloadend = () => {
                img.src = reader.result;
                img.onload = () => {
                    if (img.width < 900 || img.height < 200) {
                        alert('A imagem deve ter pelo menos 900x200 pixels.');
                    } else {
                        setImageToCrop(reader.result);
                        setShowCropper(true);
                    }
                };
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
            <span>Tamanho mínimo permitido é de 900x200, a imagem deve ter um formato retangular, proporção de 9:2.</span>

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
