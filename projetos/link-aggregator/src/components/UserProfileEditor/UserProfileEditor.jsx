import React from 'react';
import { useAuth } from '../../hooks/useAuthentication';
import useUserProfile from '../../hooks/useUserProfile';
import ProfilePictureUploader from '../../components/ProfilePictureUploader/ProfilePictureUploader';
import BannerUploader from '../../components/BannerUploader/BannerUploader';
import './UserProfileEditor.css';

const UserProfileEditor = () => {
    const { currentUser, updatePasswordUser } = useAuth();
    const {
        name, setName,
        mention, setMention,
        newPassword, setNewPassword,
        confirmPassword, setConfirmPassword,
        error, successMessage,
        isLoading, handleSave,
        handlePasswordChange
    } = useUserProfile(currentUser);

    return (
        <div className="user-profile-editor">
            <h2>Editar Perfil</h2>
            {successMessage && <p className="success">{successMessage}</p>}
            {error && <p className="error">{error}</p>}
            <ProfilePictureUploader />
            <BannerUploader />
            <div>
                <label htmlFor="name">
                    Nome (opcional):
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Seu nome"
                    />
                </label>
                <label htmlFor="mention">
                    Menção/Apelido (obrigatório):
                    <input
                        type="text"
                        id="mention"
                        value={mention}
                        onChange={(e) => setMention(e.target.value)}
                        placeholder="menção/apelido"
                        required
                    />
                </label>
            </div>
            <div>
                <label htmlFor="email">
                    E-mail:
                    <input
                        type="email"
                        id="email"
                        value={currentUser ? currentUser.email : ''}
                        disabled
                        placeholder="Seu e-mail"
                    />
                </label>
            </div>
            <div>
                <form onSubmit={(e) => e.preventDefault()}>
                    <label htmlFor="new-password">
                        <span>Nova Senha:</span>
                        <input
                            type="password"
                            id="new-password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Digite a nova senha"
                        />
                    </label>
                    <label htmlFor="confirm-password">
                        <span>Confirmar Nova Senha:</span>
                        <input
                            type="password"
                            id="confirm-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirme a nova senha"
                        />
                    </label>
                </form>
            </div>
            <button onClick={handleSave} disabled={isLoading}>Salvar Informações</button>
            <button onClick={() => handlePasswordChange(updatePasswordUser)} disabled={isLoading}>Atualizar Senha</button>
        </div>
    );
};

export default UserProfileEditor;
