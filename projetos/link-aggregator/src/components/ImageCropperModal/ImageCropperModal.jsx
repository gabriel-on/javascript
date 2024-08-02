import React, { useRef } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import './ImageCropperModal.css';

const ImageCropperModal = ({ image, onCrop, onClose }) => {
    const cropperRef = useRef(null);

    const handleCrop = () => {
        if (cropperRef.current && cropperRef.current.cropper) {
            const croppedImage = cropperRef.current.cropper.getCroppedCanvas().toDataURL();
            onCrop(croppedImage);
        }
    };

    const aspectRatio = 9 / 2; // largura e altura do corte

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Recortar Imagem</h2>
                <Cropper
                    ref={cropperRef}
                    src={image}
                    style={{ height: 400, width: '100%' }}
                    guides={true}
                    viewMode={1}
                    zoomable={false}
                    scalable={false}
                    movable={false}
                    aspectRatio={aspectRatio}
                />
                <div className="modal-actions">
                    <button onClick={handleCrop}>Recortar</button>
                    <button onClick={onClose}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

export default ImageCropperModal;
