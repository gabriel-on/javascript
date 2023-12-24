// SearchForm.js
import React from 'react';
import { useForm } from 'react-hook-form';
import api from '../../axios/config';

const SearchForm = ({ onSearch }) => {
    const { register, handleSubmit } = useForm();

    const onSubmit = async (data) => {
        try {
            const response = await api.get(`/posts/?q=${data.searchTerm}`);
            onSearch(response.data, data.searchTerm);
        } catch (error) {
            console.error('Erro na pesquisa:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="search-bar"></label>
            <input
                type="search"
                name="search-bar"
                id="search-bar"
                placeholder="Buscar Games"
                {...register('searchTerm')}
            />
            <button type="submit">Pesquisar</button>
        </form>
    );
};

export default SearchForm;
