import { useState } from "react"
import { useNavigate } from 'react-router-dom'
import '../searchbar/Searchbar.css'

const SearchForm = () => {

    const navigate = useNavigate()
    const [query, setQuery] = useState()

    const handleSubmit = (e) => {
        e.preventDefault()
        navigate(`/search?q=${query}`)
    }

  return (
      <form onSubmit={handleSubmit} className="form-search">
          <input type="search" id="search-bar" placeholder='ex: euro' onChange={(e) => setQuery(e.target.value)} />
          <button className="btn-search">Buscar</button>
      </form>
  )
}

export default SearchForm