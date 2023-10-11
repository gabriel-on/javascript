import api from '../../axios/config'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import '../home/Home.css'

import React from 'react'

const Home = () => {

  const [posts, setPosts] = useState([])
  const [search, setSearch] = useState("")

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
      {/* <form action="">
        <label htmlFor="search-bar">Games</label>
        <input type="search" name="search-bar" id="search-bar" onChange={(e) => setSearch(e.target.value)}/>
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
      
        // <div key={posts}>
        //   {posts
        //     .filter((item) => {
        //       if (search === ""){
        //         return item
        //       } else if (item.title.toLowerCase().includes(search.toLowerCase())){
        //         return item
        //       }
        //     })
        //     .map((item) => {
        //       return <div key={item.id}>
        //         <Link to={`/posts/${item.id}`}>
        //           <h4>{item.title}</h4>
        //           <img src={item.img} alt="" />
        //           <p>{item.description}</p>
        //         </Link>
        //       </div>
        //     })}
        // </div>
      )}
    </div>
  )
}

export default Home