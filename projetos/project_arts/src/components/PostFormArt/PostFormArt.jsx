import React from 'react';
import usePostForm from '../../hooks/usePostForm';
import './PostFormArt.css'; // Certifique-se de ajustar o caminho conforme necessário

const PostFormArt = () => {
    const {
        title,
        setTitle,
        description,
        setDescription,
        link,
        setLink,
        image,
        handleImageChange,
        loading,
        allowDownload,
        setAllowDownload,
        error,
        preview,
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
                    <label>Imagem:</label>
                    <input type="file" onChange={handleImageChange} required />
                    {error && <p className='error-message'>{error}</p>}
                    {preview && <img src={preview} alt="Pré-visualização" className='preview-image' />}
                </div>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={allowDownload}
                            onChange={(e) => setAllowDownload(e.target.checked)}
                        />
                        Permitir download da imagem
                    </label>
                </div>
                <button type="submit" disabled={loading}>Postar</button>
            </form>
        </div>
    );
};

export default PostFormArt;
