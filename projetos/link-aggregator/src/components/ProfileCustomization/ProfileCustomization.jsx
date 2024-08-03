import React from 'react';
import './ProfileCustomization.css';
import useProfileCustomization from '../../hooks/useProfileCustomization';

const ProfileCustomization = ({ userId }) => {
    const {
        fontFamily,
        setFontFamily,
        textColor,
        setTextColor,
        backgroundColor,
        setBackgroundColor,
        hoverBackgroundColor,
        setHoverBackgroundColor,
        borderColor,
        setBorderColor,
        loading,
        handleSave,
    } = useProfileCustomization(userId);

    const colorOptions = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#000000', '#FFFFFF'];
    const backgroundOptions = ['#f5f5f5', '#FFD700', '#ADD8E6', '#90EE90', '#FFB6C1', '#DDA0DD', '#FFFFFF'];
    const hoverOptions = ['#e0e0e0', '#cccccc', '#b3b3b3', '#a6a6a6', '#999999'];

    return (
        <div className="customization-container">
            <h3>Personalizar Perfil</h3>
            <div className="form-group">
                <label htmlFor="fontFamily">Fonte:</label>
                <select id="fontFamily" value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
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
                            onClick={() => setTextColor(color)}
                            style={{
                                backgroundColor: color,
                                width: '30px',
                                height: '30px',
                                border: 'none',
                                cursor: 'pointer',
                                margin: '0 5px',
                                outline: textColor === color ? '2px solid #000' : 'none'
                            }}
                        />
                    ))}
                </div>
                <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
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
                            onClick={() => setBackgroundColor(color)}
                            style={{
                                backgroundColor: color,
                                width: '30px',
                                height: '30px',
                                border: 'none',
                                cursor: 'pointer',
                                margin: '0 5px',
                                outline: backgroundColor === color ? '2px solid #000' : 'none'
                            }}
                        />
                    ))}
                </div>
                <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
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
                            onClick={() => setHoverBackgroundColor(color)}
                            style={{
                                backgroundColor: color,
                                width: '30px',
                                height: '30px',
                                border: 'none',
                                cursor: 'pointer',
                                margin: '0 5px',
                                outline: hoverBackgroundColor === color ? '2px solid #000' : 'none'
                            }}
                        />
                    ))}
                </div>
                <input
                    type="color"
                    value={hoverBackgroundColor}
                    onChange={(e) => setHoverBackgroundColor(e.target.value)}
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
            <div className="form-group">
                <label>Cor da Borda:</label>
                <input
                    type="color"
                    value={borderColor}
                    onChange={(e) => setBorderColor(e.target.value)}
                    style={{ marginLeft: '10px' }}
                />
                <div
                    className="color-sample"
                    style={{
                        backgroundColor: borderColor,
                        width: '50px',
                        height: '50px',
                        border: `1px solid ${borderColor}`,
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
