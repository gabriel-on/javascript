import { useState } from "react"
import { useNavigate } from 'react-router-dom'
import '../searchbar/Searchbar.css'

const SearchForm = () => {

    const navigate = useNavigate()
    const [query, setQuery] = useState()

    const handleSubmit = (e) => {
        e.preventDefault()
        navigate("/search?q=" + query)
    }

  return (
      <form onSubmit={handleSubmit} className="form">
          <input type="search" id="search-bar-md" placeholder='Buscar Games' onChange={(e) => setQuery(e.target.value)} />
          <input type="submit" value="Buscar" />
      </form>
  )
}

export default SearchForm