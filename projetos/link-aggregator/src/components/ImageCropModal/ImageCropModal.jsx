import React, { useRef } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

const ImageCropperModal = ({ image, onCrop, onClose }) => {
    const cropperRef = useRef(null);

    const handleCrop = () => {
        if (cropperRef.current && cropperRef.current.cropper) {
            const croppedImage = cropperRef.current.cropper.getCroppedCanvas().toDataURL();
            onCrop(croppedImage);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Recortar Imagem</h2>
                <Cropper
                    ref={cropperRef}
                    src={image}
                    style={{ height: 200, width: '100%' }}
                    initialAspectRatio={16 / 9}
                    aspectRatio={16 / 9}
                    guides={false}
                />
                <button onClick={handleCrop}>Recortar</button>
                <button onClick={onClose}>Cancelar</button>
            </div>
        </div>
    );
};

export default ImageCropperModal;
