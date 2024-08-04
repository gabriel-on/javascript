import React from 'react';
import './TermsOfService.css';

const TermsOfService = () => {
    return (
        <div className="terms-container">
            <h1>Termos de Uso</h1>
            <p>Última atualização: [04/08/2024]</p>
            <h2>Índice</h2>
            <ul>
                <li><a href="#aceitacao">1. Aceitação dos Termos</a></li>
                <li><a href="#uso_site">2. Uso do Site</a></li>
                <li><a href="#conta_usuario">3. Conta de Usuário</a></li>
                <li><a href="#conteudo_usuario">4. Conteúdo do Usuário</a></li>
                <li><a href="#propriedade_intelectual">5. Propriedade Intelectual</a></li>
                <li><a href="#limitacao_responsabilidade">6. Limitação de Responsabilidade</a></li>
                <li><a href="#alteracoes">7. Alterações aos Termos</a></li>
                <li><a href="#lei">8. Lei Aplicável</a></li>
            </ul>
            <h2 id="aceitacao">1. Aceitação dos Termos</h2>
            <p>Ao acessar ou usar nosso site, você concorda em cumprir e estar vinculado a estes Termos de Uso.</p>

            <h2 id="uso_site">2. Uso do Site</h2>
            <p>Você se compromete a usar o site apenas para fins legais e de acordo com todas as leis aplicáveis.</p>

            <h2 id="conta_usuario">3. Conta de Usuário</h2>
            <p>Para acessar certas funcionalidades, você pode precisar criar uma conta. Você é responsável por manter a confidencialidade das suas informações de conta e por todas as atividades que ocorrem sob sua conta.</p>

            <h2 id="conteudo_usuario">4. Conteúdo do Usuário</h2>
            <p>Você é o único responsável pelo conteúdo que cria, publica ou compartilha no site.</p>

            <h2 id="propriedade_intelectual">5. Propriedade Intelectual</h2>
            <p>Todo o conteúdo, marcas registradas e propriedade intelectual no site são de propriedade nossa ou de nossos licenciadores.</p>

            <h2 id="limitacao_responsabilidade">6. Limitação de Responsabilidade</h2>
            <p>O site é fornecido "como está" e não garantimos que estará livre de erros ou interrupções.</p>

            <h2 id="alteracoes">7. Alterações aos Termos</h2>
            <p>Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. Quaisquer alterações serão publicadas no site.</p>

            <h2 id="lei">8. Lei Aplicável</h2>
            <p>Estes Termos de Uso são regidos pelas leis do Brasil.</p>
        </div>
    );
};

export default TermsOfService;
