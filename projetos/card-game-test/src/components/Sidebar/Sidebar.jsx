import React from 'react';
import '../Sidebar/Sidebar.css';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <h2>Menu</h2>
            <ul>
                <li>
                    <NavLink to="/" className="nav-link">
                        <i className='bi bi-house-fill'></i>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/search">
                        <i className='bi bi-search'></i>
                    </NavLink>
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;