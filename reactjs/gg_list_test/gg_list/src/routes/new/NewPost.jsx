import { Form } from '../../components/form/Form';
import { api } from '../../axios/config'
import { useNavigate } from 'react-router-dom'

export function NewPost () {

  const navigate = useNavigate()

  // fetch("http://localhost:8000/developers", {
  //   method: "GET",
  //   headers: {
  //       headers: {"Content-Type" : "aplication/json"}
  //   }
  // })
    
  //   .then((response) => response.json())
  //   .then((data) => {
  //     setDevelopers(data)
  //   })

  function newPost(data) {
    api.post("/posts", data)
    
    navigate("/")
  }

  return (
    <div>
      <Form title={"Criar"} textButton={"Adicionar"} onActions={newPost}/>

      {/* <select name="sel" id="sel">
        <option value=""></option>
        {options.map((option) => {
        <option value={option.id} key={option.id}>{option.name}</option>
        })}
      </select> */}
    </div>
  )
}

export default NewPost