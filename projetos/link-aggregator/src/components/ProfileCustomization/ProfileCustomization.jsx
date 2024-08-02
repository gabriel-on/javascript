import React, { useEffect, useState } from 'react';
import { ref, update, onValue } from 'firebase/database'; // Adicione onValue para ler dados
import { database } from '../../firebase/config';
import './ProfileCustomization.css';
import { useAuth } from '../../hooks/useAuthentication';

const ProfileCustomization = ({ userId }) => {
    const { currentUser } = useAuth();
    const [fontFamily, setFontFamily] = useState('Arial'); // Valor padrão
    const [textColor, setTextColor] = useState('#000'); // Valor padrão
    const [loading, setLoading] = useState(false);

    // useEffect para buscar as configurações atuais
    useEffect(() => {
        const userCustomizationRef = ref(database, `users/${userId}/customizations`);
        onValue(userCustomizationRef, (snapshot) => {
            const customizations = snapshot.val();
            if (customizations) {
                setFontFamily(customizations.fontFamily || 'Arial');
                setTextColor(customizations.textColor || '#000');
            }
        });
    }, [userId]); // Dependência do userId

    const handleFontChange = (e) => {
        setFontFamily(e.target.value);
    };

    const handleColorChange = (color) => {
        setTextColor(color);
    };

    const handleColorInputChange = (e) => {
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

    // Lista de cores pré-determinadas
    const colorOptions = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#000000', '#FFFFFF'];

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
                <label>Cor do Texto:</label>
                <div className="color-options">
                    {colorOptions.map((color) => (
                        <button
                            key={color}
                            onClick={() => handleColorChange(color)}
                            style={{
                                backgroundColor: color,
                                width: '30px',
                                height: '30px',
                                border: 'none',
                                cursor: 'pointer',
                                margin: '0 5px',
                                outline: textColor === color ? '2px solid #000' : 'none' // Adiciona um contorno para a cor selecionada
                            }}
                        />
                    ))}
                </div>
                {/* Seletor de cor */}
                <input
                    type="color"
                    value={textColor}
                    onChange={handleColorInputChange}
                    style={{ marginLeft: '10px' }}
                />
                {/* Amostra da cor selecionada */}
                <div
                    className="color-sample"
                    style={{
                        backgroundColor: textColor,
                        width: '50px',
                        height: '50px',
                        border: '1px solid #ccc',
                        marginLeft: '10px'
                    }}
                />
            </div>
            <button className="save-btn" onClick={handleSave} disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar'}
            </button>
        </div>
    );
};

export default ProfileCustomization;
