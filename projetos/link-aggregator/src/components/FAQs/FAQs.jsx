import React, { useState } from 'react';
import './FAQs.css';

const FAQs = () => {
    const [expandedIndex, setExpandedIndex] = useState(null);

    const handleToggle = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    const faqs = [
        {
            question: 'O que é o HIGHLINKS?',
            answer: 'HIGHLINKS é um agregador de links personalizado (Independente) que permite organizar e compartilhar todos os seus links importantes em um só lugar. É ideal para influenciadores, criadores de conteúdo e qualquer pessoa que precise gerenciar vários links de maneira fácil e eficiente.'
        },
        {
            question: 'Como posso criar uma conta no HIGHLINKS?',
            answer: 'Para criar uma conta, clique no botão "Comece Agora" na página inicial e siga as instruções para se registrar.'
        },
        {
            question: 'É possível editar os links adicionados?',
            answer: 'Sim, você pode editar e gerenciar seus links na seção "Adicionar Novos Links" no seu dashboard.'
        },
        {
            question: 'Como posso compartilhar meu perfil?',
            answer: 'Você pode compartilhar seu perfil copiando o link do seu perfil e enviando para outras pessoas. Basta clicar no botão "Copiar Link" no seu dashboard.'
        },
        {
            question: 'O que fazer se eu esquecer minha senha?',
            answer: 'Se você esquecer sua senha, clique em "Esqueci minha senha" na página de login e siga as instruções para redefini-la.'
        },
        {
            question: 'Como posso deletar minha conta?',
            answer: 'Se você deseja deletar sua conta no HIGHLINKS, vá para as configurações da sua conta no dashboard e clique na opção "Deletar Conta". Siga as instruções para confirmar a exclusão. Note que essa ação é irreversível e todos os seus dados serão perdidos.'
        }
    ];

    return (
        <div className="faqs-container">
            <h1>FAQs - Perguntas Frequentes</h1>
            {faqs.map((faq, index) => (
                <div key={index} className="faq-item">
                    <h3 onClick={() => handleToggle(index)}>
                        {faq.question}
                        <button className="toggle-button">
                            {expandedIndex === index ? '-' : '+'}
                        </button>
                    </h3>
                    <p className={`faq-answer ${expandedIndex === index ? 'show' : ''}`}>
                        {faq.answer}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default FAQs;
