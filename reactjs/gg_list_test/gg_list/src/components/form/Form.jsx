import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../axios/config';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import '../form/Form.css';
import DevelopersList from '../DevelopersList/DevelopersList';

const genresList = [
  "Ação", "Aventura", "RPG", "FPS", "MOBA", "Esportes", "Corrida", "RTS", "Simulação", "Quebra-Cabeças", "Horror", "Indie Games", "Luta", "Battle Royale", "Sandbox", "MMORPG", "Musical/Ritmo", "Simulação de Vida", "Realidade Virtual (VR)", "Outros"
];

const postSchema = yup.object({
  title: yup.string().required("O campo é obrigatório"),
  img: yup.string().required("O campo é obrigatório"),
  content: yup.string().required("O campo é obrigatório"),
  description: yup.string().required("O campo é obrigatório"),
  genres: yup.array().of(yup.string()).min(1, "Selecione pelo menos um gênero"),
  // developer: yup.string().required("Selecione a desenvolvedora"),
});

export function Form({ title, textButton, onActions }) {
  const { id } = useParams();
  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm({
    resolver: yupResolver(postSchema),
    defaultValues: {
      genres: [],
      developer: "",
    },
  });
  const navigate = useNavigate();

  useEffect(() => {
    const getDataUpdate = async () => {
      try {
        if (id) {
          const response = await api.get(`/posts/${id}`);
          reset(response.data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    getDataUpdate();
  }, [id, reset]);

  const onSubmit = async (data) => {
    try {
      const postData = {
        title: data.title,
        img: data.img,
        content: data.content,
        description: data.description,
        genres: data.genres,
        developer: data.developer,
      };

      if (id) {
        await api.put(`/posts/${id}`, postData);
      } else {
        await api.post('/posts', postData);
      }

      navigate("/");
    } catch (err) {
      console.error(err);
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

      {/* <DevelopersList onSelectDeveloper={(selectedDeveloper) => setValue("developer", selectedDeveloper)} /> */}

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
