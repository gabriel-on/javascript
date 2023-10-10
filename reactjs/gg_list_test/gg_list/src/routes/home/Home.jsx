import api from '../../axios/config'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import '../home/Home.css'

import React from 'react'

const Home = () => {

  const [posts, setPosts] = useState([])
  // const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    api.get("/posts")

    .then((response) => {
      setPosts(response.data)
      // setRecords(response.data)
    })
    .catch((err) => {
      console.log(err)
    })
  }, [])

  return (
    <div className='home'>
      {/* <form>
        <input type="text" name="search_bar" id="search_bar" onChange={(e) => setSearchTerm(e.target.value)}/>
      </form> */}

      {posts.length === 0 ? (
        <p>Carregando...</p>
      ) : (
        posts
        .map((post) => (
          <div key={post.id}>
            <Link to={`/posts/${post.id}`}>
              <h2>{post.title}</h2>
              <img src={post.img} alt="" />
              <p>{post.description}</p>
            </Link>
          </div>
        ))
      )}
    </div>
  )
}

export default Home