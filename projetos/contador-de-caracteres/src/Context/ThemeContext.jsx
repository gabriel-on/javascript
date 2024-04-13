// ThemeContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        // Tente obter o tema salvo do armazenamento local
        const savedTheme = localStorage.getItem('theme');
        // Retorna o tema salvo ou o tema padrão 'light'
        return savedTheme || 'light';
    });

    useEffect(() => {
        // Ao mudar o tema, salve-o no armazenamento local
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
