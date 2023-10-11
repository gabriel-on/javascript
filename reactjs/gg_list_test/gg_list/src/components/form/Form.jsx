import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../axios/config'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useEffect, useState } from 'react'

const postScrema = yup.object({
  title: yup.string().required("O campo é obrigatorio"),
  img: yup.string().required("O campo é obrigatorio"),
  content: yup.string().required("O campo é obrigatorio"),
  description: yup.string().required("O campo é obrigatorio"),
  developer: yup.string().required("O campo é obrigatorio")
})

export function Form({title, textButton, onActions, developers}) {

  const {id} = useParams()

  const navigate = useNavigate()

  const [developer, setDeveloper] = useState([])

  const {register, handleSubmit, formState: {errors}, reset } = useForm({
    resolver: yupResolver(postScrema)
  })

  async function getDataUpdate() {
    const response = await api.get(`/posts/${id}`)
    reset(response.data)
  }

  useEffect(() => {
    getDataUpdate()

    .catch((err) => {
      console.log(err)
    })
  }, [])

  return (
    <form onSubmit={handleSubmit(onActions)}>
      <h2>{title}</h2>
      <div className="field">
        <input placeholder="Título" {...register("title")}/>
        {errors.title?.message}
      </div>

      <div className="field">
        <input type="url" name="foto" id="foto" placeholder="IMAGEM URL" {...register("img")} alt='Foto'/>
        {errors.img?.message}
      </div>

      <div className="field">
        <input placeholder="Descrição" {...register("description")}/>
        {errors.description?.message}
      </div>

      <div className="field">
        <textarea  placeholder="Conteudo" {...register("content")}/>
        {errors.content?.message}
      </div>

      <div className="field">
        <input placeholder="Desenvolvedor" {...register("developer")}/>
      {errors.developer?.message}
      {/* {errors.developer?.message}

      <select name="" id="" {...register("developer")} options={developer}>
        <option value="">--SELECIONAR--</option>
        {developers.map((developer) => (
          <option value={developer.id} key={developer.id}>{developer.id}</option>
        ))}
      </select> */}
      </div> 

      <button type='submit'>{textButton}</button>
    </form>
  );
}