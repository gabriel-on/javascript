import '../nav/Navbar.css'
import { Link } from 'react-router-dom'

const Navbar = () => {

  return (
    <div className='navbar'>
      <h2>
        <Link to={"/"}>GameList</Link>
      </h2>
      <ul>
        <li>
          <Link to={"/"}>Home</Link>
        </li>
        <li>
          <Link to={"/new"}>Adicionar Jogo</Link>
        </li>
        <li>
          <Link to={"/admin"}>Gerenciar</Link>
        </li>
        <li>
          <Link to={"/developers"}>Devs</Link>
        </li>
      </ul>
    </div>
  )
}

export default Navbar