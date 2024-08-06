import React, { useState } from 'react';
import { database } from '../../firebase/config'; // Importar sua configuração do Firebase
import { ref, set } from 'firebase/database';
import './Contact.css'; // Crie um arquivo CSS para estilizar a página

const Contact = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validar os campos
        if (!name || !email || !message) {
            setError('Por favor, preencha todos os campos.');
            return;
        }

        try {
            // Enviar dados para o Firebase
            const messageRef = ref(database, 'messages/' + Date.now()); // Usando timestamp como chave única
            await set(messageRef, {
                name,
                email,
                message,
            });

            // Limpar o formulário
            setName('');
            setEmail('');
            setMessage('');
            setSuccess(true);
        } catch (err) {
            console.error('Erro ao enviar mensagem: ', err);
            setError('Ocorreu um erro ao enviar sua mensagem. Tente novamente mais tarde.');
        }
    };

    return (
        <div className="contact-container">
            <h1>Contato</h1>
            {success && <p className="success-message">Mensagem enviada com sucesso!</p>}
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Nome:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">E-mail:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="message">Mensagem:</label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                    ></textarea>
                </div>
                <button type="submit">Enviar</button>
            </form>
        </div>
    );
};

export default Contact;
