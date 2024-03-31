import React from 'react'
import { NavLink } from 'react-router-dom'

function NavBar() {
  return (
    <div>
        <NavLink to={'/'}></NavLink>
        <ul>
            <li>
                <NavLink to={'/'}>
                    <p>Pagina Incial</p>
                </NavLink>
            </li>
            <li>
                <NavLink to={'/editor'}>
                    <p>Editor</p>
                </NavLink>
            </li>
            
        </ul>
    </div>
  )
}

export default NavBar