import { useState, useEffect } from 'react'
import { Card } from '../../components/Card'
import { api } from '../../lib/axios'
import './styles.css'

export function Feed() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    api.get("/posts")

      .then((response) => {
        setPosts(response.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  function handleDelete(id) {
    setPosts(posts.filter(post => post.id !== id))
    api.delete(`/posts/${id}`)
  }

  return (
    <div className="feedContainer">
      {posts.map((post) => (
        <div key={post.id}>
          <Card key={post.id} post={post} onDeletePost={handleDelete} />
        </div>
      ))}
    </div>
  );
}
