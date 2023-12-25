import api from '../../axios/config'
import { useEffect, useState } from 'react'
import React from 'react'
import { Link , useSearchParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import SearchForm from '../searchForm/SearchForm'

const Searchbar = () => {
  
  const navigate = useNavigate()
  // navigate("")

  const [searchParams] = useSearchParams()
  const [posts, setPosts] = useState([])
  
  useEffect(() => {
    api.get(`/posts?${searchParams}`)
    
    .then((response) => {
      setPosts(response.data)
    })
    .catch((err) => {
      console.log(err)
    })
  }, [])
  
  return (
    <div>
      <SearchForm/>
    </div>
  )
}

export default Searchbar