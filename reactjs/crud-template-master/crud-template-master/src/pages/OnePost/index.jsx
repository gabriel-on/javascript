import { useEffect, useState } from "react";
import "./styles.css";
import { api } from "../../lib/axios";
import { useParams } from "react-router-dom";

export function OnePost() {
  const {id} = useParams()

  const [post, setPost] = useState({})

  useEffect(() => {
    api.get(`/posts/${id}`)
    .then(response => setPost(response.data))
    .catch(err => console.log(err))
  }, [])

  return (
    <article className="onePostContainer">
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <span>{post.author}</span>
    </article>
  );
}
