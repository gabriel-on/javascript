import { useEffect, useState } from 'react';
import { ref, update, onValue } from 'firebase/database';
import { database } from '../firebase/config'; // Ajuste o caminho conforme sua estrutura

const useProfileCustomization = (userId) => {
    const [fontFamily, setFontFamily] = useState('Arial');
    const [textColor, setTextColor] = useState('#000');
    const [backgroundColor, setBackgroundColor] = useState('#f5f5f5');
    const [hoverBackgroundColor, setHoverBackgroundColor] = useState('#e0e0e0');
    const [borderColor, setBorderColor] = useState('#000');
    const [hoverTextColor, setHoverTextColor] = useState('#000');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const userCustomizationRef = ref(database, `users/${userId}/customizations`);
        onValue(userCustomizationRef, (snapshot) => {
            const customizations = snapshot.val();
            if (customizations) {
                setFontFamily(customizations.fontFamily || 'Arial');
                setTextColor(customizations.textColor || '#000');
                setBackgroundColor(customizations.backgroundColor || '#f5f5f5');
                setHoverBackgroundColor(customizations.hoverBackgroundColor || '#e0e0e0');
                setBorderColor(customizations.borderColor || '#000');
                setHoverTextColor(customizations.hoverTextColor || '#000');
            }
        });
    }, [userId]);

    const handleSave = async () => {
        setLoading(true);
        const userRef = ref(database, `users/${userId}/customizations`);

        try {
            await update(userRef, {
                fontFamily,
                textColor,
                backgroundColor,
                hoverBackgroundColor,
                borderColor,
                hoverTextColor,
            });
            alert('Configurações salvas com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar as configurações: ', error);
        } finally {
            setLoading(false);
        }
    };

    return {
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
        hoverTextColor,
        setHoverTextColor,
        loading,
        handleSave,
    };
};

export default useProfileCustomization;
