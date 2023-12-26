import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
    return (
        <div>
            <h1>Erro 404</h1>
            <p>A página que você está procurando não foi encontrada.</p>
            <Link to={"/"}>
                <h1>
                    Retornar à página principal
                </h1>
            </Link>
            {/* Adicione outros elementos ou estilos conforme necessário */}
        </div>
    );
};

export default ErrorPage;