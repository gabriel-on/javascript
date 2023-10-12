import { useState } from 'react'
import './App.css'
import Modal from './components/Modal'

function App() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className='app'>
      <Modal isOpen={modalOpen} setIsOpen={setModalOpen} closeButton={false} backdropClose={true}>
        <div>
          <h1>Modal</h1> 
        </div>
      </Modal>
      <div>
        <button onClick={() =>{
            setModalOpen(true)
          }}>
            Botão
        </button>
      </div>
    </div>
  )
}

export default App
