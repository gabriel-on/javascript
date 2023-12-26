import { Form } from '../../components/form/Form';
import { api } from '../../axios/config'
import { useNavigate } from 'react-router-dom'

export function NewPost () {

  const navigate = useNavigate()

  function newPost(data) {
    api.post("/posts", data)
    
    navigate("/")
  }

  return (
    <div>
      <Form title={"Adicionar Game"} textButton={"Adicionar"} onActions={newPost}/>
    </div>
  )
}

export default NewPost