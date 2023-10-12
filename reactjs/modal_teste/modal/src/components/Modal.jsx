const Modal = ({ children, isOpen, setIsOpen, id="modalClass", closeButton = true, backdropClose = false }) => {
    if (!isOpen) return null

    const handleBackdropClick = (e) => {
        if (e) e.preventDefault()
        if (!backdropClose || e.target.id == id) return
        setIsOpen(false)
    }

    return ( 
        <div id={id} className="backdrop" onClick={handleBackdropClick}>
            <div className="modal">
                {closeButton ? <button type="button" className="modal-close" onClick={() => setIsOpen(false)}/> : null}
            {children}
            </div>
        </div>
    )
}

export default Modal