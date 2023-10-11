import api from '../../axios/config'
import { useEffect, useState } from 'react'
import {useForm} from 'react-hook-form'
import React from 'react'

const Searchbar = () => {

  const {id} = useParams()

  function searchTerm(data) {
      api.get(`/posts/${id}`, data)
  }

  return (
    <div>
      <input type={Form} onActions={searchTerm}/>
    </div>
  )
}

export default Searchbar