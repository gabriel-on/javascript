import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../axios/config'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useEffect, useState } from 'react'
import '../form/Form.css'
import OptionDev from '../OptionDeveloper/OptionDev'

const postScrema = yup.object({
  title: yup.string().required("O campo é obrigatorio"),
  img: yup.string().required("O campo é obrigatorio"),
  content: yup.string().required("O campo é obrigatorio"),
  description: yup.string().required("O campo é obrigatorio"),
  // developer: yup.string().required("O campo é obrigatorio")
  gender: yup.string().required("O campo é obrigatório"),
  tags: yup.array().of(yup.string()).required("Pelo menos uma tag é obrigatória"),
})

export function Form({ title, textButton, onActions }) {

  const { id } = useParams()

  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm({
    resolver: yupResolver(postScrema)
  })

  async function getDataUpdate() {
    const response = await api.get(`/posts/${id}`)
    reset(response.data)

    // As tags devem ser um array, então configuramos os valores apropriadamente
    setValue("tags", response.data.tags);
  }

  useEffect(() => {
    getDataUpdate()

      .catch((err) => {
        console.log(err)
      })
  }, [])

  const handleFormSubmit = (data) => {
    // Converte a string de tags em um array antes de chamar a função onActions
    const tagsArray = data.tags.split(',').map(tag => tag.trim());
    onActions({ ...data, tags: tagsArray });
  };

  return (
    <form onSubmit={handleSubmit(onActions)} className='form-model'>
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
        <input placeholder="Descrição" {...register("description")} />
        {errors.description?.message}
      </div>

      <div className="field">
        <textarea placeholder="Conteudo" {...register("content")} />
        {errors.content?.message}
      </div>

      {/* <div className="field">
        <input placeholder="Desenvolvedor" {...register("developer")}/>
        {errors.developer?.message}
      </div> */}

      <div className="field">
        <label htmlFor="gender">Gênero</label>
        <select id="gender" {...register("gender")}>
          <option value="">Selecione o gênero</option>
          <option value="action">Ação</option>
          <option value="adventure">Aventura</option>
          <option value="other">Outro</option>
        </select>
        {errors.gender?.message}
      </div>

      <div className="field">
        <label htmlFor="tags">Tags (separadas por vírgulas)</label>
        <input
          type="text"
          id="tags"
          {...register("tags")}
          placeholder="Insira as tags separadas por vírgulas"
        />
        {errors.tags?.message}
      </div>

      <button type='submit'>{textButton}</button>
    </form>
  );
}