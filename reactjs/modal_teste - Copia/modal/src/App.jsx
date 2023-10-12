import React, { useState } from 'react';
import './index.css';
import Modal from './components/Modal';

function App() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className='page'>
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
      </Modal>
      <div>
        <button onClick={() => setOpenModal(true)} className='modalButton'>
          Botão
        </button>
      </div>
    </div>
  )
}

export default App;