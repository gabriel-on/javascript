import api from '../../axios/config'
import { useEffect, useState } from 'react'
import {useForm} from 'react-hook-form'
import React from 'react'

const Searchbar = () => {

  return (
    <div className='search-bar' >

        <form >
          <label htmlFor="search-bar"></label>
          <input type="search" name="search-bar" id="search-bar" placeholder='Buscar Games' onChange={(e) => setSearch(e.target.value)}/>
        </form>

        {/* {posts.length === 0 ? (
          <p>Carregando...</p>
        ) : ( */}


        <div className='search-results' key={posts}>
            {posts
              .filter((item) => {
                if (search === ""){
                  return
                } else if (item.title.toLowerCase().includes(search.toLowerCase())){
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
        {/* )} */}
      </div>
  )
}

export default Searchbar