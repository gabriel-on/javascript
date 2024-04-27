import React, { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// CSS
import '../CoverBannerUploader/CoverBannerUploader.css';

function CoverBannerUploader({ onUpload }) {
  const [coverFile, setCoverFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [uploading, setUploading] = useState(false); // Estado para controlar a animação do botão
  const [selected, setSelected] = useState(false); // Estado para controlar se os arquivos foram selecionados
  const [coverPreview, setCoverPreview] = useState(null); // Estado para armazenar a miniatura da capa
  const [bannerPreview, setBannerPreview] = useState(null); // Estado para armazenar a miniatura do banner
  const [uploadComplete, setUploadComplete] = useState(false); // Estado para controlar se o upload foi concluído

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    setCoverFile(file);
    checkSelected(file);
    // Criar a miniatura da capa
    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverPreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    } else {
      setCoverPreview(null);
    }
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    setBannerFile(file);
    checkSelected(file);
    // Criar a miniatura do banner
    const reader = new FileReader();
    reader.onloadend = () => {
      setBannerPreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    } else {
      setBannerPreview(null);
    }
  };

  const checkSelected = (file) => {
    if (file) {
      setSelected(true); // Se algum arquivo for selecionado, define selected como true
    } else {
      setSelected(false); // Se nenhum arquivo for selecionado, define selected como false
    }
  };

  const handleUpload = async () => {
    const storage = getStorage();
    const coverRef = ref(storage, `covers/${coverFile.name}`);
    const bannerRef = ref(storage, `banners/${bannerFile.name}`);

    setUploading(true); // Ativar animação do botão

    try {
      await uploadBytes(coverRef, coverFile);
      await uploadBytes(bannerRef, bannerFile);

      const coverUrl = await getDownloadURL(coverRef);
      const bannerUrl = await getDownloadURL(bannerRef);

      onUpload({ coverUrl, bannerUrl });

      setUploading(false); // Desativar animação do botão após o upload
      setSelected(false); // Resetar o estado dos arquivos selecionados
      setUploadComplete(true); // Definir upload como concluído
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      // Lidar com erros de upload aqui
    }
  };

  return (
    <div className='upload-writer-cantainer'>
      <>
        <div className='upload-writer-item'>
          <h2>Capa</h2>
          <input type="file" onChange={handleCoverChange} />
          {coverPreview && <img src={coverPreview} alt="Capa" className="preview-image" />}
        </div>
        <div className='upload-writer-item'>
          <h2>Banner</h2>
          <input type="file" onChange={handleBannerChange} />
          {bannerPreview && <img src={bannerPreview} alt="Banner" className="preview-image" />}
        </div>
      </>
      <button onClick={handleUpload} className={`btn-upload-writer ${uploading ? 'uploading' : ''} ${selected ? 'selected' : ''} ${uploadComplete ? 'completed' : ''}`}>
        {uploading ? 'Uploading...' : (uploadComplete ? 'Concluído' : (selected ? 'Upload' : 'Selecionar Arquivos'))}
      </button>
    </div>
  );
}

export default CoverBannerUploader;
