import { useEffect, useState } from 'react'
import '../nav/Navbar.css'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'

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
          <Link to={"/login"}>Login</Link>
        </li>
        <li>
          <Link to={"/search"} className='link-search'>
            <i className="bi bi-search"></i>
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default Navbar