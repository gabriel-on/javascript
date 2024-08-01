import React, { useState } from 'react';
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
        currentPassword, setCurrentPassword,
        newPassword, setNewPassword,
        confirmPassword, setConfirmPassword,
        error, successMessage,
        isLoading, handleSave,
        handlePasswordChange
    } = useUserProfile(currentUser);

    // Estado para controlar a visibilidade das senhas
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Função para determinar a força da senha
    const getPasswordStrength = (password) => {
        if (password.length < 6) return 'fraca';
        if (password.length < 10) return 'média';
        return 'forte';
    };

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
                    <label htmlFor="current-password">
                        <span>Senha Atual:</span>
                        <input
                            type={showCurrentPassword ? 'text' : 'password'}
                            id="current-password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Digite a senha atual"
                            required
                        />
                        <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                            {showCurrentPassword ? 'Ocultar' : 'Mostrar'}
                        </button>
                    </label>
                    <label htmlFor="new-password">
                        <span>Nova Senha:</span>
                        <input
                            type={showNewPassword ? 'text' : 'password'}
                            id="new-password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Digite a nova senha"
                        />
                        <button type="button" onClick={() => setShowNewPassword(!showNewPassword)}>
                            {showNewPassword ? 'Ocultar' : 'Mostrar'}
                        </button>
                        <p>Força da senha: {getPasswordStrength(newPassword)}</p>
                    </label>
                    <label htmlFor="confirm-password">
                        <span>Confirmar Nova Senha:</span>
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="confirm-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirme a nova senha"
                        />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                            {showConfirmPassword ? 'Ocultar' : 'Mostrar'}
                        </button>
                    </label>
                    {newPassword && confirmPassword && newPassword !== confirmPassword && (
                        <p className="error">As senhas não coincidem.</p>
                    )}
                </form>
            </div>
            <button onClick={handleSave} disabled={isLoading}>Salvar Informações</button>
            <button onClick={() => handlePasswordChange(updatePasswordUser)} disabled={isLoading}>Atualizar Senha</button>
        </div>
    );
};

export default UserProfileEditor;
