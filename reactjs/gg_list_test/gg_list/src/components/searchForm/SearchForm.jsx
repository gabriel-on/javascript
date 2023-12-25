import React from 'react'
import { useState, useEffect } from 'react'
import { api } from '../../axios/config'
import { Link } from 'react-router-dom'

import '../searchForm/searchForm.css'

const SearchForm = () => {

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
        <div className='search-bar-container'>
            <h1 className='re-title'>Buscar Games</h1>

            {/* BARRA DE PESQUISA */}
            <div className='re-search-bar'>
                <form >
                    <label htmlFor="search-bar"></label>
                    <input type="search" name="search-bar" id="search-bar" placeholder='Buscar...' onChange={(e) => setSearch(e.target.value)} />
                </form>

                {posts.length === 0 ? (
                    <p className='loadind-bar'>Carregando...</p>
                ) : (
                    <div className='bar-search-results' key={posts}>
                        {posts
                            .filter((item) => {
                                if (search === "") {
                                    return item
                                } else if (item.title.toLowerCase().includes(search.toLowerCase())) {
                                    return item
                                }
                            })
                            .map((item) => {
                                return <div key={item.id}>
                                    <Link to={`/posts/${item.id}`}>
                                        <h2>{item.title}</h2>
                                        <img src={item.img} alt="" />
                                    </Link>
                                </div>
                            })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default SearchForm