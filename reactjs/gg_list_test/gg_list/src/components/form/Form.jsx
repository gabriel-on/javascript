import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { api } from '../../axios/config';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import DevelopersList from '../DevelopersList/DevelopersList';

import '../form/Form.css'

const genresList = [
  "Ação", "Aventura", "RPG", "FPS", "MOBA", "Esportes", "Corrida", "RTS", "Simulação", "Quebra-Cabeças", "Horror", "Indie Games", "Luta", "Battle Royale", "Sandbox", "MMORPG", "Musical/Ritmo", "Simulação de Vida", "Realidade Virtual (VR)", "Outros"
];

const postSchema = yup.object({
  title: yup.string().required("O campo é obrigatório"),
  img: yup.string().required("O campo é obrigatório"),
  content: yup.string().required("O campo é obrigatório"),
  description: yup.string().required("O campo é obrigatório"),
  genres: yup.array().of(yup.string()).min(1, "Selecione pelo menos um gênero"),
});

export function Form({ title, textButton, onActions }) {
  const { id } = useParams();
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(postSchema),
    defaultValues: {
      genres: [],
      developers: [], // Certifique-se de inicializar developers como um array vazio
    },
  });
  const navigate = useNavigate();

  const [selectedDevelopers, setSelectedDevelopers] = useState([]);

  useEffect(() => {
    const getDataUpdate = async () => {
      try {
        if (id) {
          const response = await api.get(`/posts/${id}`);
          reset(response.data);
          setSelectedDevelopers(response.data.developers || []);
        }
      } catch (err) {
        console.error(err);
      }
    };

    getDataUpdate();
  }, [id, reset]);

  const onDeveloperToggle = (developer) => {
    setSelectedDevelopers((prevSelectedDevelopers) => {
      if (prevSelectedDevelopers.includes(developer)) {
        return prevSelectedDevelopers.filter((dev) => dev !== developer);
      } else {
        return [...prevSelectedDevelopers, developer];
      }
    });
  };

  const onSubmit = async (data) => {
    try {
      // Adicionando a validação Yup
      await postSchema.validate(data, { abortEarly: false });

      // Verifique se pelo menos uma desenvolvedora foi selecionada
      if (selectedDevelopers.length === 0) {
        // Exiba uma mensagem de erro ou tome a ação apropriada
        alert("Selecione pelo menos uma desenvolvedora.");
        return;
      }

      const postData = {
        title: data.title,
        img: data.img,
        content: data.content,
        description: data.description,
        genres: data.genres,
        developers: selectedDevelopers,
      };

      if (id) {
        await api.put(`/posts/${id}`, postData);
      } else {
        await api.post('/posts', postData);
      }

      navigate(`/admin`);
    } catch (err) {
      if (err.name === 'ValidationError') {
        // Trate os erros de validação Yup
        console.error(err.errors);
      } else {
        console.error(err);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='form-model'>
      <h2>{title}</h2>
      <div className="field">
        <input placeholder="Título" {...register("title")} />
        {errors.title?.message}
      </div>

      <div className="field">
        <input type="url" name="foto" id="foto" placeholder="IMAGEM URL" {...register("img")} alt='Foto' />
        {errors.img?.message}
      </div>

      <div className="field">
        <label>Gêneros:</label>
        <div className='genres-list'>
          {genresList.map((genre) => (
            <div key={genre} className='genre'>
              <input
                type="checkbox"
                id={`genre-${genre}`}
                value={genre}
                {...register("genres")}
              />
              <label htmlFor={`genre-${genre}`}>{genre}</label>
            </div>
          ))}
        </div>
        {errors.genres?.message}
      </div>

      <div className="field">
        <DevelopersList
          selectedDevelopers={selectedDevelopers}
          onDeveloperToggle={onDeveloperToggle}
        />
        {errors.developers?.message}
      </div>

      <div className="field">
        <input placeholder="Descrição" {...register("description")} />
        {errors.description?.message}
      </div>

      <div className="field">
        <textarea placeholder="Conteúdo" {...register("content")} />
        {errors.content?.message}
      </div>

      <button type='submit'>{textButton}</button>
    </form>
  );
}
