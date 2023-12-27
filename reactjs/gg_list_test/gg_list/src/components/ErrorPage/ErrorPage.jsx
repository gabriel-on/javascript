import React from 'react';
import { Link } from 'react-router-dom';
import '../ErrorPage/ErrorPage.css'

const ErrorPage = () => {
    return (
        <div className='error'>
            <h1>Erro 404</h1>
            <p>A página que você está procurando não foi encontrada.</p>
            <Link to={"/"}>
                <h2>
                    Retornar à página principal
                </h2>
            </Link>
            {/* Adicione outros elementos ou estilos conforme necessário */}
        </div>
    );
};

export default ErrorPage;