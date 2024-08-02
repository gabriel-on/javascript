import React, { useState } from 'react';
import useProfilePictureUploader from '../../hooks/useProfilePictureUploader';
import './ProfilePictureUploader.css';
import ImageProfileCropperModal from '../ImageProfileCropperModal/ImageProfileCropperModal';

const ProfilePictureUploader = () => {
  const { handleSaveImage } = useProfilePictureUploader();
  const [showCropper, setShowCropper] = useState(false);
  const [imageToCrop, setImageToCrop] = useState('');
  const [previewImage, setPreviewImage] = useState('');

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileSizeInKB = file.size / 1024; // Tamanho em KB
      const maxSizeInKB = 250; // Limite máximo de tamanho em KB

      if (fileSizeInKB > maxSizeInKB) {
        alert(`O arquivo deve ter no máximo ${maxSizeInKB} KB. Você enviou ${fileSizeInKB.toFixed(2)} KB.`);
        return;
      }

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

  return (
    <div className="profile-picture-uploader">
      <h2>Atualizar Imagem de Perfil</h2>
      <div className="profile-picture-preview">
        {previewImage && (
          <img
            src={previewImage}
            alt="Preview"
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
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
        <ImageProfileCropperModal
          image={imageToCrop}
          onCrop={handleCrop}
          onClose={() => setShowCropper(false)}
        />
      )}
    </div>
  );
};

export default ProfilePictureUploader;
