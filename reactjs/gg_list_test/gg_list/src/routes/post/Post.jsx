import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../axios/config'
import { Link } from 'react-router-dom'

const Post = () => {

  const {id} = useParams()

  const [post, setPost] = useState({})

  useEffect(() => {
    api.get(`/posts/${id}`)
    .then(response => setPost(response.data))
    .catch(err => console.log(err))
  }, [])

  return (
    <div className='post'>
      <h2>{post.title}</h2>
      <img src={post.img} alt="" />
      <Link to="/">
        <p>{post.developer}</p>
      </Link>
    </div>
  )
}

export default Post