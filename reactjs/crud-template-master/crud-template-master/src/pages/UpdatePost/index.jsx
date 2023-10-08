import { Form } from "../../components/Form";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../lib/axios";
import { useEffect } from "react";

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