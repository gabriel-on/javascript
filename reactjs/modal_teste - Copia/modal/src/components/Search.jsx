import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../axios/Config'

const Search = ({pesq, setPesq}) => { if (!pesq) return

  const [posts, setPosts] = useState([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    api.get("/posts")

      .then((response) => {
        setPosts(response.data)
      })
      .catch((err) => {
        console.log(err)
      })
    }, [])

  return (
    <div className='navbar'>

      {/* BARRA DE PESQUISA */}
      <div className='search-bar' >
        <form onClick={setPesq}>
          <label htmlFor="search-bar"></label>
          <input type="search" name="search-bar" id="search-bar" placeholder='Buscar Games' onChange={(e) => setSearch(e.target.value)} onClick={(e) => e.stopPropagation()}/>
        </form>

        <div className='search-results' key={posts}>
            {posts
              .filter((item) => {
                if (search === ""){
                  return
                } else if (item.title.toLowerCase().includes(search.toLowerCase())){
                  return item
                }
              })
              .map((item) => {
                return <div key={item.id}>
                  <Link to={`/posts/${item.id}`}>
                    <img src={item.img} alt="FOTO" />
                    <div>
                      <h4>{item.title}</h4>
                      <p>{item.description}</p>
                    </div>
                  </Link>
                </div>
              })}
          </div>
        {/* )} */}
      </div>
    </div>
  )
}

export default Search