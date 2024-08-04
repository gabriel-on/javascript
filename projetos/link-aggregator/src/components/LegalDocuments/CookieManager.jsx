import React, { useEffect, useState } from 'react';
import './CookieManager.css';

const CookieManager = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Verifica se o consentimento de cookies foi dado
        const consent = getCookie('cookieConsent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    // Função para definir um cookie
    const setCookie = (name, value, days) => {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    };

    // Função para ler um cookie
    const getCookie = (name) => {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    };

    // Função para excluir um cookie
    const deleteCookie = (name) => {
        document.cookie = name + '=; Max-Age=-99999999; path=/';
    };

    // Função para aceitar cookies
    const handleAcceptCookies = () => {
        setCookie('cookieConsent', 'true', 30); // Define o consentimento por 30 dias
        setIsVisible(false);
    };

    const handleDeclineCookies = () => {
        deleteCookie('cookieConsent'); // Exclui o cookie de consentimento
        setIsVisible(false);
    };

    if (!isVisible) return null; // Não exibe o aviso se já houver consentimento

    return (
        <div className='cookie-container'>
            <div>
                <h2><i className="bi bi-cookie"></i> Gerenciador de Cookies</h2>
            </div>
            <p>
                Este site utiliza cookies para oferecer uma melhor experiência. Ao continuar, você concorda com o uso de cookies.
            </p>
            <button onClick={handleAcceptCookies}>Aceitar Cookies</button>
            <button onClick={handleDeclineCookies}>Recusar Cookies</button>
        </div>
    );
};

export default CookieManager;
