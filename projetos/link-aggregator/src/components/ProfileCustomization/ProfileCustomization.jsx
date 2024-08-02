import React, { useEffect, useState } from 'react';
import { ref, update } from 'firebase/database';
import { database } from '../../firebase/config';
import './ProfileCustomization.css';
import { useAuth } from '../../hooks/useAuthentication';

const ProfileCustomization = ({ userId, currentStyles }) => {
    const { currentUser } = useAuth();
    const [fontFamily, setFontFamily] = useState(currentStyles?.fontFamily || 'Arial'); // Valor padrão
    const [textColor, setTextColor] = useState(currentStyles?.textColor || '#000'); // Valor padrão
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (currentStyles) {
            setFontFamily(currentStyles.fontFamily || 'Arial');
            setTextColor(currentStyles.textColor || '#000');
        }
    }, [currentStyles]);

    const handleFontChange = (e) => {
        setFontFamily(e.target.value);
    };

    const handleColorChange = (e) => {
        setTextColor(e.target.value);
    };

    const handleSave = async () => {
        if (!currentUser) {
            alert('Você precisa estar autenticado para salvar as configurações.');
            return;
        }

        // Atualizando a referência para incluir o nó customizations
        const userRef = ref(database, `users/${userId}/customizations`);
        console.log(`Salvando dados em: ${userRef}`);

        setLoading(true);

        try {
            await update(userRef, {
                fontFamily: fontFamily || 'Arial',
                textColor: textColor || '#000000',
            });
            alert('Configurações salvas com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar as configurações: ', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="customization-container">
            <h3>Personalizar Perfil</h3>
            <div className="form-group">
                <label htmlFor="fontFamily">Fonte:</label>
                <select id="fontFamily" value={fontFamily} onChange={handleFontChange}>
                    <option value="Arial">Arial</option>
                    <option value="Courier New">Courier New</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Verdana">Verdana</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="textColor">Cor do Texto:</label>
                <input
                    type="color"
                    id="textColor"
                    value={textColor}
                    onChange={handleColorChange}
                />
            </div>
            <button className="save-btn" onClick={handleSave} disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar'}
            </button>
        </div>
    );
};

export default ProfileCustomization;
