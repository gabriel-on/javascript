// PaginatedList.jsx
import React, { useState, useEffect } from 'react';

import './App.css'

const PaginatedList = ({ data, itemsPerPage }) => {
    const [currentPage, setCurrentPage] = useState(() => {
        // Recupera a página atual do localStorage, ou usa 1 se não existir
        return parseInt(localStorage.getItem('currentPage')) || 1;
    });
    const [currentData, setCurrentData] = useState([]);
    const [loading, setLoading] = useState(true)

    const totalPages = Math.ceil(data.length / itemsPerPage);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)

                const startIndex = (currentPage - 1) * itemsPerPage;
                const endIndex = startIndex + itemsPerPage;
                const newData = data.slice(startIndex, endIndex);
                setCurrentData(newData);

                // Salva a página atual no localStorage
                localStorage.setItem('currentPage', currentPage.toString())
            } catch (error) {
                console.error('Erro ao buscar dados:', error.messege)
            } finally {
                setLoading(false)
            }
        }
        fetchData();
    }, [currentPage, data, itemsPerPage]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <div>
            {/* Renderizar a lista atual */}
            {loading ? (
                <p>Carregando...</p>
            ) : (
                currentData.map((item) => (
                    <div key={item.id}>
                        <p>{item.name}</p>
                        {/* Renderizar detalhes do item */}
                    </div>
                ))
            )}

            {/* Paginação */}
            <div>
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    Anterior
                </button>
                <span>Página {currentPage} de {totalPages}</span>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    Próxima
                </button>
            </div>
        </div>
    );
};

export default PaginatedList;

// Thx u ChatGPT