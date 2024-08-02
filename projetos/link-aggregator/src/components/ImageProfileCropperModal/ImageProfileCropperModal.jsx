import React, { useRef } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import './ImageProfileCropperModal.css'; // Adicione um arquivo CSS para estilos, se necessário.

const ImageProfileCropperModal = ({ image, onCrop, onClose }) => {
    const cropperRef = useRef(null);

    const handleCrop = () => {
        if (cropperRef.current && cropperRef.current.cropper) {
            const croppedImage = cropperRef.current.cropper.getCroppedCanvas().toDataURL();
            onCrop(croppedImage);
        }
    };

    const aspectRatio = 1; // Proporção 1:1 para imagem de perfil

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Recortar Imagem de Perfil</h2>
                <Cropper
                    ref={cropperRef}
                    src={image}
                    style={{ height: 400, width: '100%' }}
                    guides={true}
                    viewMode={1}
                    zoomable={false}
                    scalable={false}
                    movable={false}
                    aspectRatio={aspectRatio} // Mantém a proporção 1:1
                />
                <span>Tamanho recomendado: 200x200</span>
                <div className="modal-actions">
                    <button onClick={handleCrop}>Recortar</button>
                    <button onClick={onClose}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

export default ImageProfileCropperModal;
