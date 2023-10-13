import React, { useEffect, useState } from 'react'
import api from '../../axios/config'
import { useParams } from 'react-router-dom'
import '../OptionDeveloper/OptionDev.css'

const OptionDev = () => {

    const {id} = useParams()

    const [developer, setDeveloper] = useState([])
    
    useEffect(() => {
        api.get(`/developers`)
    
        .then((response) => {
          setDeveloper(response.data)
        })
        .catch((err) => {
          console.log(err)
        })
      }, [])

  return (
    <div className='developer'>
        {/* {developer.length === 0 ? (
        <p>Carregando...</p>
    ) : ( */}
        <h1>Desenvolvedor</h1>
        <select name='developer' >
            {/* <option>--SELECIONAR--</option> */}
            {
                developer.map((developer) =>
                    <option key={developer.id} >{developer.name}</option>
                )}
        </select>
    </div>
  )
}

export default OptionDev