import React, { useEffect, useState } from 'react';
import { ref, update, onValue } from 'firebase/database';
import { database } from '../../firebase/config';
import './ProfileCustomization.css';
import { useAuth } from '../../hooks/useAuthentication';

const ProfileCustomization = ({ userId }) => {
    const { currentUser } = useAuth();
    const [fontFamily, setFontFamily] = useState('Arial'); // Valor padrão
    const [textColor, setTextColor] = useState('#000'); // Valor padrão
    const [backgroundColor, setBackgroundColor] = useState('#f5f5f5'); // Valor padrão
    const [hoverBackgroundColor, setHoverBackgroundColor] = useState('#e0e0e0'); // Valor padrão para hover
    const [loading, setLoading] = useState(false);

    // useEffect para buscar as configurações atuais
    useEffect(() => {
        const userCustomizationRef = ref(database, `users/${userId}/customizations`);
        onValue(userCustomizationRef, (snapshot) => {
            const customizations = snapshot.val();
            if (customizations) {
                setFontFamily(customizations.fontFamily || 'Arial');
                setTextColor(customizations.textColor || '#000');
                setBackgroundColor(customizations.backgroundColor || '#f5f5f5'); // Nova cor de fundo
                setHoverBackgroundColor(customizations.hoverBackgroundColor || '#e0e0e0'); // Nova cor de fundo para hover
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

    const handleBackgroundColorChange = (color) => {
        setBackgroundColor(color);
    };

    const handleBackgroundColorInputChange = (e) => {
        setBackgroundColor(e.target.value);
    };

    const handleHoverBackgroundColorChange = (color) => {
        setHoverBackgroundColor(color);
    };

    const handleHoverBackgroundColorInputChange = (e) => {
        setHoverBackgroundColor(e.target.value);
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
                backgroundColor: backgroundColor || '#f5f5f5', // Salvando a nova cor de fundo
                hoverBackgroundColor: hoverBackgroundColor || '#e0e0e0', // Salvando a nova cor de fundo para hover
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

    // Lista de cores de fundo pré-determinadas
    const backgroundOptions = ['#f5f5f5', '#FFD700', '#ADD8E6', '#90EE90', '#FFB6C1', '#DDA0DD', '#FFFFFF'];

    // Lista de cores de hover pré-determinadas
    const hoverOptions = ['#e0e0e0', '#cccccc', '#b3b3b3', '#a6a6a6', '#999999'];

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
                                outline: textColor === color ? '2px solid #000' : 'none' // Contorno para a cor selecionada
                            }}
                        />
                    ))}
                </div>
                <input
                    type="color"
                    value={textColor}
                    onChange={handleColorInputChange}
                    style={{ marginLeft: '10px' }}
                />
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
            <div className="form-group">
                <label>Cor de Fundo:</label>
                <div className="color-options">
                    {backgroundOptions.map((color) => (
                        <button
                            key={color}
                            onClick={() => handleBackgroundColorChange(color)}
                            style={{
                                backgroundColor: color,
                                width: '30px',
                                height: '30px',
                                border: 'none',
                                cursor: 'pointer',
                                margin: '0 5px',
                                outline: backgroundColor === color ? '2px solid #000' : 'none' // Contorno para a cor selecionada
                            }}
                        />
                    ))}
                </div>
                <input
                    type="color"
                    value={backgroundColor}
                    onChange={handleBackgroundColorInputChange}
                    style={{ marginLeft: '10px' }}
                />
                <div
                    className="color-sample"
                    style={{
                        backgroundColor: backgroundColor,
                        width: '50px',
                        height: '50px',
                        border: '1px solid #ccc',
                        marginLeft: '10px'
                    }}
                />
            </div>
            <div className="form-group">
                <label>Cor de Fundo para Hover:</label>
                <div className="color-options">
                    {hoverOptions.map((color) => (
                        <button
                            key={color}
                            onClick={() => handleHoverBackgroundColorChange(color)}
                            style={{
                                backgroundColor: color,
                                width: '30px',
                                height: '30px',
                                border: 'none',
                                cursor: 'pointer',
                                margin: '0 5px',
                                outline: hoverBackgroundColor === color ? '2px solid #000' : 'none' // Contorno para a cor selecionada
                            }}
                        />
                    ))}
                </div>
                <input
                    type="color"
                    value={hoverBackgroundColor}
                    onChange={handleHoverBackgroundColorInputChange}
                    style={{ marginLeft: '10px' }}
                />
                <div
                    className="color-sample"
                    style={{
                        backgroundColor: hoverBackgroundColor,
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
