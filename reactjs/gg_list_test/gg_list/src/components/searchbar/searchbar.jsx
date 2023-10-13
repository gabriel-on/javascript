import api from '../../axios/config'
import { useEffect, useState } from 'react'
import React from 'react'
import { Link , useSearchParams } from 'react-router-dom'
// import { useNavigate } from 'react-router-dom'

const Searchbar = () => {
  
  // const navigate = useNavigate("")
  // navigate("")

  const [searchParams] = useSearchParams()
  const [posts, setPosts] = useState([])

  useEffect(() => {
    api.get("/posts?" + searchParams)

      .then((response) => {
        setPosts(response.data)
      })
      .catch((err) => {
        console.log(err)
      })
    }, [])

  return (
    <div>
      {posts.length === 0 ? (
        <p>Carregando...</p>
      ) : (
        <div className='search-results'>
          {posts
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
  )
}

export default Searchbar