import { useEffect, useState } from 'react'
import '../nav/Navbar.css'
import { Link } from 'react-router-dom'
import api from '../../axios/config'

const Navbar = () => {

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

      {/* LOGO */}
      <h2>
        <Link to={"/"}>GameList</Link>
      </h2>

      {/* BARRA DE PESQUISA */}
      <div className='search-bar'>
        <form>
          <label htmlFor="search-bar"></label>
          <input type="search" name="search-bar" id="search-bar" placeholder='Buscar Games' onChange={(e) => setSearch(e.target.value)} />
        </form>

        {posts.length === 0 ? (
          <p>Carregando...</p>
        ) : (
        
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
        )}
      </div>

      {/* NAVBAR */}
      <ul>
        <li>
          <Link to={"/"}>Home</Link>
        </li>
        <li>
          <Link to={"/new"}>Adicionar Jogo</Link>
        </li>
        <li>
          <Link to={"/admin"}>Gerenciar</Link>
        </li>
        <li>
          <Link to={"/developers"}>Devs</Link>
        </li>
      </ul>
      

      
    </div>
  )
}

export default Navbar