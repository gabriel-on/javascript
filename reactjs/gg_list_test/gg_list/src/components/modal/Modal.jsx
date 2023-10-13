import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import api from '../../axios/config';

const Modal = ({ open, onClose }) => {
    if (!open) return null

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
        <div onClick={onClose} className='overlay'>
            <div onClick={(e) => e.stopPropagation()}
                className='modalContainer'>
                <div className='search-results' key={posts} onClick={() => setOpenModal(true)}>
                    {posts
                        .filter((item) => {
                            if (search === "") {
                                return
                            } else if (item.title.toLowerCase().includes(search.toLowerCase())) {
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
            </div>
        </div>
    )
}

export default Modal