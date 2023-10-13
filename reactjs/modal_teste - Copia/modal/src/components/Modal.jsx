import { useEffect, useState } from 'react';
import { api } from '../axios/Config';
import Search from './Search';

const Modal = ({ open, onClose }) => {
    if (!open) return null

  // const [posts, setPosts] = useState([])
  // const [search, setSearch] = useState(true)

  return (
    <div onClick={onClose} className='overlay'>
      <div onClick={(e) => e.stopPropagation()}
        className='modalContainer'>

        <div className='modalRight'>
          <p className='closeBtn' onClick={onClose}>
            X
          </p>
          <div className='content'>
            <p>Você quer</p>
            <h1>R$20 de CREDITOS?</h1>

            {/* <Search pesq={search} setPesq={() => setSearch(false)}>
              <input type="text" />
            </Search> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal