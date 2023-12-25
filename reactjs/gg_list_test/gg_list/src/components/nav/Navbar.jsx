import { useEffect, useState } from 'react'
import '../nav/Navbar.css'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import Searchbar from '../searchbar/Searchbar'
import SearchForm from '../searchForm/SearchForm'

const Navbar = () => {

  return (
    <div className='navbar'>

      {/* LOGO */}
      <h2>
        <Link to={"/"}>GameList</Link>
      </h2>

      {/* NAVBAR */}
      <ul>
        <li>
          <Link to={"/"}>Home</Link>
        </li>
        <li>
          <Link to={"/developers"}>Devs</Link>
        </li>
        <li>
          <Link to={"/new"}>Adicionar Jogo</Link>
        </li>
        <li>
          <Link to={"/admin"}>Gerenciar</Link>
        </li>
        <li>
          <Link to={"/search"}>Buscar</Link>
        </li>
      </ul>



    </div>
  )
}

export default Navbar