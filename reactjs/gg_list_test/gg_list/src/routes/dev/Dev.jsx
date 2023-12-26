import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../axios/config'

const Dev = () => {

  const [developers, setDevelopers] = useState([])

  useEffect(() => {
    api.get("/developers/?_embed=posts")
      .then((response) => {
        setDevelopers(response.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])
  
  return (
    <div>
      {developers.map((developer) => (
        <div key={developer.id}>
          <Link to={`/developers/${developer.id}`}>
            <h2>{developer.name}</h2>
            <img src={developer.img} alt="foto" />
          </Link>
        </div>
      ))}
    </div>
  )
}

export default Dev