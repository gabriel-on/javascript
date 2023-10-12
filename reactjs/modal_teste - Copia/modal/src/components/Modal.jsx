import React from 'react';

const Modal = ({ open, onClose }) => {
    if (!open) return null

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
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal