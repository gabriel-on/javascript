import React, { useEffect, useState } from 'react';
import './index.css';
import Modal from './components/Modal';
import api from './axios/Config';

function App() {
  const [openModal, setOpenModal] = useState(false);
  const [posts, setPosts] = useState([])

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
    <div className='page'>
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
      </Modal>
      <div>
        <button onClick={() => setOpenModal(true)} className='modalButton'>
          Botão
        </button>
        {/* <img src={"https://media-rockstargames-com.akamaized.net/rockstargames-newsite/img/global/games/fob/1280/V.jpg"} alt="" onClick={() => setOpenModal(true)}/> */}
      </div>
    </div>
  )
}

export default App;