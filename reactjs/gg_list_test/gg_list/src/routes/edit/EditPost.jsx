import { Form } from "../../components/form/Form.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../axios/config.js";

export function UpdatePost() {

    const navigate = useNavigate()

    const {id} = useParams()

    function handleUpdate(data) {
        api.put(`/posts/${id}`, data)
        navigate("/")
    }

    return (
        <div>
            <Form title={"Editar publicação"} textButton={"Editar"} onActions={handleUpdate}/>
        </div>
    )
}

export default UpdatePost