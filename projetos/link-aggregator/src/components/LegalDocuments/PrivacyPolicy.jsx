import React from 'react';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
    return (
        <div className="privacy-container">
            <h1>Política de Privacidade</h1>
            <p>Última atualização: [04/08/2024]</p>
            <h2>Índice</h2>
            <ul>
                <li><a href="#coleta-informacoes">1. Coleta de Informações</a></li>
                <li><a href="#uso_informacoes">2. Uso das Informações</a></li>
                <li><a href="#compartilhamento_informacoes">3. Compartilhamento de Informações</a></li>
                <li><a href="#cookies">4. Cookies</a></li>
                <li><a href="#seguranca">5. Segurança</a></li>
                <li><a href="#direitos">6. Seus Direitos</a></li>
                <li><a href="#alteracoes">7. Alterações à Política de Privacidade</a></li>
                <li><a href="#contato">8. Contato</a></li>
            </ul>
            <h2 id="coleta-informacoes">1. Coleta de Informações</h2>
            <p>Coletamos informações pessoais, como nome, e-mail e outros dados que você nos fornece ao se registrar ou usar o site.</p>

            <h2 id="uso_informacoes">2. Uso das Informações</h2>
            <p>Usamos suas informações para fornecer e manter o serviço, notificá-lo sobre mudanças em nosso serviço e permitir que você participe de recursos interativos.</p>

            <h2 id="compartilhamento_informacoes">3. Compartilhamento de Informações</h2>
            <p>Não compartilhamos suas informações pessoais com terceiros sem seu consentimento, exceto quando exigido por lei.</p>

            <h2 id="cookies">4. Cookies</h2>
            <p>O site pode usar cookies para melhorar a experiência do usuário. Você pode controlar o uso de cookies nas configurações do seu navegador.</p>

            <h2 id="seguranca">5. Segurança</h2>
            <p>Implementamos medidas de segurança para proteger suas informações pessoais. No entanto, nenhuma transmissão pela internet é completamente segura.</p>

            <h2 id="direitos">6. Seus Direitos</h2>
            <p>Você tem o direito de acessar, corrigir ou excluir suas informações pessoais a qualquer momento.</p>

            <h2 id="alteracoes">7. Alterações à Política de Privacidade</h2>
            <p>Podemos atualizar nossa Política de Privacidade periodicamente. Informaremos sobre quaisquer mudanças publicando a nova Política de Privacidade no site.</p>

            <h2 id="contato">8. Contato</h2>
            <p>Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco em [seu e-mail de contato].</p>
        </div>
    );
};

export default PrivacyPolicy;
