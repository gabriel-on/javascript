import React, { useEffect, useState } from 'react';
import { api } from '../../axios/config';

const ClassificacoesSelect = ({ selectedClassificacao, onClassificacaoChange }) => {
    const [classificacoesList, setClassificacoesList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [localSelectedClassificacao, setLocalSelectedClassificacao] = useState(selectedClassificacao);

    useEffect(() => {
        const fetchClassificacoes = async () => {
            try {
                const response = await api.get('/classificacoesIndicativas');
                setClassificacoesList(response.data);
            } catch (error) {
                setError(error.message || 'Erro ao buscar as classificações indicativas');
            } finally {
                setLoading(false);
            }
        };

        fetchClassificacoes();
    }, []);

    const handleClassificacaoChange = (nome) => {
        setLocalSelectedClassificacao(nome);
        onClassificacaoChange(nome);
    };

    if (loading) {
        return <p>Carregando classificações indicativas...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="field">
            <label>Classificação Indicativa:</label>
            <div>
                {classificacoesList.map((classificacao) => (
                    <div key={classificacao.id}>
                        <input
                            type="radio"
                            id={`classificacao-${classificacao.id}`}
                            value={classificacao.nome}
                            checked={selectedClassificacao === classificacao.nome}
                            onChange={() => onClassificacaoChange(classificacao.nome)}
                        />
                        <label htmlFor={`classificacao-${classificacao.id}`}>{classificacao.nome}</label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ClassificacoesSelect;
