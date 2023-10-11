import React from 'react'
import { useState, useEffect } from 'react'
import { api } from '../../axios/config'
import { Link } from 'react-router-dom'
import '../admin/Admin.css'

const Admin = () => {

  const [posts, setPosts] = useState([])
  const [search, setSearch] = useState("")

  const deletePost = async (id) => {
    await api.delete(`/posts/${id}`)

    alert("Excluido!")

    const filterdPosts = posts.filter((post) => post.id !== id)

    setPosts(filterdPosts)
  }

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
    <div className='admin'>
      <h1 className='md-title'>Gerenciar Games</h1>

      {/* BARRA DE PESQUISA */}
      <div className='md-search-bar'>
        <form >
          <label htmlFor="search-bar"></label>
          <input type="search" name="search-bar" id="search-bar" placeholder='Buscar...' onChange={(e) => setSearch(e.target.value)} />
        </form>

        {posts.length === 0 ? (
          <p className='loadind-admin'>Carregando...</p>
        ) : (
        
        <div className='md-search-results' key={posts}>
            {posts
              .filter((item) => {
                if (search === ""){
                  return item
                } else if (item.title.toLowerCase().includes(search.toLowerCase())){
                  return item
                }
              })
              .map((item) => {
                return <div key={item.id}>
                  <div to={`/posts/${item.id}`}>
                    <h2>{item.title}</h2>
                    <img src={item.img} alt="" />
                    <div className='btn'>
                      <Link className='md-btn' to={`/posts/edit/${item.id}`}>Editar</Link>
                      <button onClick={() => deletePost(item.id)} >Excluir</button>
                    </div>
                  </div>
                </div>
              })}
          </div>
        )}
      </div>

      {/* {posts.map((post) => (
        <div key={post.id}>
          <div to={`/posts/${post.id}`}>
            <h2>{post.title}</h2>
            <img src={post.img} alt="" />
            <Link to={`/posts/edit/${post.id}`}>Editar</Link>
            <button className='' onClick={() => deletePost(post.id)} >Excluir</button>
          </div>
        </div>
      ))} */}
    </div>
  )
}

export default Admin