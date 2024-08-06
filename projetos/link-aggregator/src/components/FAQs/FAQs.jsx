import React from 'react';
import './FAQs.css';

const FAQs = () => {
    return (
        <div className="faqs-container">
            <h1>FAQs - Perguntas Frequentes</h1>
            <div className="faq-item">
                <h3>O que é o HIGHLINKS?</h3>
                <p>HIGHLINKS é um agregador de links personalizado que permite organizar e compartilhar todos os seus links importantes em um só lugar. É ideal para influenciadores, criadores de conteúdo e qualquer pessoa que precise gerenciar vários links de maneira fácil e eficiente.</p>
            </div>
            <div className="faq-item">
                <h3>Como posso criar uma conta no HIGHLINKS?</h3>
                <p>Para criar uma conta, clique no botão "Comece Agora" na página inicial e siga as instruções para se registrar.</p>
            </div>
            <div className="faq-item">
                <h3>É possível editar os links adicionados?</h3>
                <p>Sim, você pode editar e gerenciar seus links usando a seção "Adicionar Novos Links" no seu dashboard.</p>
            </div>
            <div className="faq-item">
                <h3>Como posso compartilhar meu perfil?</h3>
                <p>Você pode compartilhar seu perfil copiando o link do seu perfil e enviando para outras pessoas. Basta clicar no botão "Copiar Link" no seu dashboard.</p>
            </div>
            <div className="faq-item">
                <h3>O que fazer se eu esquecer minha senha?</h3>
                <p>Se você esquecer sua senha, clique em "Esqueci minha senha" na página de login e siga as instruções para redefini-la.</p>
            </div>
        </div>
    );
};

export default FAQs;
