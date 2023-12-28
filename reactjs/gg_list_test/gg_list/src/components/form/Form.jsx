// Form.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { api } from '../../axios/config';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { format } from 'date-fns';
import DevelopersList from '../DevelopersList/DevelopersList';
import ReleaseDateInput from '../ReleaseDateInput/ReleaseDateInput';
import DevicesList from '../DevicesList/DevicesList';
import ClassificationsList from '../ClassificationsList/ClassificationsList';

const genresList = [
  "Ação", "Aventura", "RPG", "FPS", "MOBA", "Esportes", "Corrida", "RTS", "Simulação", "Quebra-Cabeças", "Horror", "Indie Games", "Luta", "Battle Royale", "Sandbox", "MMORPG", "Musical/Ritmo", "Simulação de Vida", "Realidade Virtual (VR)", "Outros"
];

const postSchema = yup.object({
  title: yup.string().required("O campo é obrigatório"),
  img: yup.string().required("O campo é obrigatório"),
  content: yup.string().required("O campo é obrigatório"),
  description: yup.string().required("O campo é obrigatório"),
  genres: yup.array().of(yup.string()).min(1, "Selecione pelo menos um gênero"),
  releaseDate: yup.date().required('O campo é obrigatório'),
});

export function Form({ title, textButton, onActions }) {
  const { id } = useParams();
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(postSchema),
    defaultValues: {
      genres: [],
      developers: [],
      devices: [],
      releaseDate: '',
    },
  });
  const navigate = useNavigate();

  const [selectedDevelopers, setSelectedDevelopers] = useState([]);
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [formattedReleaseDate, setFormattedReleaseDate] = useState('');
  const [selectedClassification, setSelectedClassification] = useState(1);


  useEffect(() => {
    const getDataUpdate = async () => {
      try {
        if (id) {
          const response = await api.get(`/posts/${id}`);
          reset(response.data);
          setSelectedDevelopers(response.data.developers || []);
          setSelectedDevices(response.data.devices || []);

          const releaseDate = new Date(response.data.releaseDate);
          if (!isNaN(releaseDate.getTime())) {
            const brazilianFormat = format(releaseDate, 'dd-MM-yyyy');
            setFormattedReleaseDate(brazilianFormat);
          }

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

  const onDeviceToggle = (device) => {
    setSelectedDevices((prevSelectedDevices) => {
      if (prevSelectedDevices.includes(device)) {
        return prevSelectedDevices.filter((dev) => dev !== device);
      } else {
        return [...prevSelectedDevices, device];
      }
    });
  };

  const onSubmit = async (data) => {
    try {
      await postSchema.validate(data, { abortEarly: false });

      if (selectedDevelopers.length === 0) {
        alert("Selecione pelo menos uma desenvolvedora.");
        return;
      }
      if (selectedDevices.length === 0) {
        alert("Selecione pelo menos uma plataforma.");
        return;
      }

      const formattedDate = format(new Date(data.releaseDate), 'dd-MM-yyyy');

      const postData = {
        title: data.title,
        img: data.img,
        content: data.content,
        description: data.description,
        genres: data.genres,
        releaseDate: formattedDate,
        developers: selectedDevelopers,
        devices: selectedDevices,
        classification: selectedClassification,
      };

      if (id) {
        await api.put(`/posts/${id}`, postData);
      } else {
        await api.post('/posts', postData);
      }

      navigate(`/admin`);
    } catch (err) {
      if (err.name === 'ValidationError') {
        console.error(err.errors);
      } else {
        console.error(err);
      }
    }
  };

  const handleClassificationChange = (id) => {
    console.log(`Selected classification ID: ${id}`);
    // Você pode adicionar lógica adicional aqui conforme necessário
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
        <DevicesList
          selectedDevices={selectedDevices}
          onDeviceToggle={onDeviceToggle}
        />
        {errors.devices?.message}
      </div>

      <div className='field'>
        <ReleaseDateInput
          register={register}
          errors={errors}
          defaultValue={formattedReleaseDate ? format(new Date(formattedReleaseDate), 'yyyy-MM-dd') : ''}
          onChange={(e) => setFormattedReleaseDate(e.target.value)}
        />
      </div>

      <div className="field">
        <input placeholder="Descrição" {...register("description")} />
        {errors.description?.message}
      </div>

      <div className='field'>
        <ClassificationsList
          classificationInicial={selectedClassification} onClassificationChange={setSelectedClassification}
        />
      </div>

      <div className="field">
        <textarea placeholder="Conteúdo" {...register("content")} />
        {errors.content?.message}
      </div>

      <button type='submit'>{textButton}</button>
    </form>
  );
}