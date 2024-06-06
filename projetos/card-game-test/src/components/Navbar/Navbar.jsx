import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuthentication';
import '../Navbar/Navbar.css';

function Navbar() {
    const { currentUser, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };

    return (
        <div className='navbar-container'>
            <div className='navbar'>
                <ul >
                    <li className='brand'>
                        <NavLink to={"/"}>
                            <h1>CardGame</h1>
                        </NavLink>
                    </li>
                </ul>
                <ul >
                    <li className='nav-page'>
                        <NavLink to={"/"}>Home</NavLink>
                    </li>
                    {!currentUser && (
                        <li>
                            <NavLink to={"/login"}>Login</NavLink>
                        </li>
                    )}
                    {!currentUser && (
                        <li>
                            <NavLink to={"/register"}>Cadastrar</NavLink>
                        </li>
                    )}
                    {currentUser && (
                        <li className='display-name'>
                            <span>Olá, {currentUser.displayName}!</span>
                        </li>
                    )}
                    {currentUser && (
                        <li className='logout-btn'>
                            <button onClick={handleLogout}>Sair</button>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
}

export default Navbar;