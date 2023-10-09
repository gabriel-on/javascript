import axios from 'axios'

export const api = axios.create({
    baseURL: "http://localhost:8000",
    // headers: {"Content-Type" : "aplication/json"}
})

export default api