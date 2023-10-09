import React from 'react'
import { useState, useEffect } from 'react'
import { api } from '../../axios/config'
import { Link } from 'react-router-dom'

const Admin = () => {

  const [posts, setPosts] = useState([])

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
      <h1>Gerenciar</h1>
      {posts.map((post) => (
        <div key={post.id}>
          <div to={`/posts/${post.id}`}>
            <h2>{post.title}</h2>
            <img src={post.img} alt="" />
            <Link to={`/posts/edit/${post.id}`}>Editar</Link>
            <button className='' onClick={() => deletePost(post.id)} >Excluir</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Admin