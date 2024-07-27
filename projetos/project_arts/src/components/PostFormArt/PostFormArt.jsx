import React from 'react';
import usePostForm from '../../hooks/usePostForm';
import './PostFormArt.css';

const PostFormArt = () => {
    const {
        title,
        setTitle,
        description,
        setDescription,
        link,
        setLink,
        images, // Agora você deve lidar com várias imagens
        handleImageChange,
        loading,
        allowDownload,
        setAllowDownload,
        error,
        previews, // Alterado para lidar com várias pré-visualizações
        handleSubmit
    } = usePostForm();

    return (
        <div className='form-container'>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Título:</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div>
                    <label>Descrição:</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                </div>
                <div>
                    <label>Link:</label>
                    <input type="url" value={link} onChange={(e) => setLink(e.target.value)} />
                </div>
                <div>
                    <label>Imagens:</label>
                    <input
                        type="file"
                        onChange={handleImageChange}
                        multiple // Permitir múltiplos arquivos
                        required
                    />
                    {error && <p className='error-message'>{error}</p>}
                    <div className='preview-container'>
                        {previews.map((preview, index) => (
                            <img key={index} src={preview} alt={`Pré-visualização ${index + 1}`} className='preview-image' />
                        ))}
                    </div>
                </div>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={allowDownload}
                            onChange={(e) => setAllowDownload(e.target.checked)}
                        />
                        Permitir download das imagens
                    </label>
                </div>
                <button type="submit" disabled={loading}>Postar</button>
            </form>
        </div>
    );
};

export default PostFormArt;
