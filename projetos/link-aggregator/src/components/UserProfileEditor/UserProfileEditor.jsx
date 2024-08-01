import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuthentication';
import useUserProfile from '../../hooks/useUserProfile';
import ProfilePictureUploader from '../../components/ProfilePictureUploader/ProfilePictureUploader';
import BannerUploader from '../../components/BannerUploader/BannerUploader';
import './UserProfileEditor.css';
import { Link } from 'react-router-dom';

const UserProfileEditor = () => {
    const { currentUser, deleteAccount } = useAuth(); // Import deleteAccount here
    const {
        name, setName,
        mention, setMention,
        currentPassword, setCurrentPassword,
        newPassword, setNewPassword,
        confirmPassword, setConfirmPassword,
        error, successMessage,
        isLoading, handleSubmit
    } = useUserProfile(currentUser);

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const getPasswordStrength = (password) => {
        if (password.length < 6) return 'fraca';
        if (password.length < 10) return 'média';
        return 'forte';
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.")) {
            try {
                await deleteAccount();
                alert("Conta deletada com sucesso.");
                // Redirecionar ou realizar outras ações conforme necessário
            } catch (error) {
                alert("Erro ao deletar conta. Tente novamente.");
            }
        }
    };

    return (
        <div className="user-profile-editor">
            <h2>Editar Perfil</h2>
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
                <label htmlFor="current-password">
                    <span>Senha Atual <span style={{ color: 'red' }}>*</span></span>
                    <span style={{ display: 'block', fontSize: '0.9em', color: '#6c757d' }}>
                        Insira sua senha atual para confirmar a atualização.
                    </span>
                    <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        id="current-password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Digite a senha atual"
                        required
                        className={currentPassword ? '' : 'error-input'}
                    />
                    <p>Esqueceu a Senha? <Link to="/forgot-password">Clique Aqui</Link>.</p>

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
            </div>
            <>
                {successMessage && <p className="success">{successMessage}</p>}
                {error && <p className="error">{error}</p>}
            </>
            <button onClick={handleSubmit} disabled={isLoading}>
                Salvar
            </button>
            <button onClick={handleDeleteAccount} className="delete-account-button">
                Deletar Conta
            </button>
        </div>
    );
};

export default UserProfileEditor;