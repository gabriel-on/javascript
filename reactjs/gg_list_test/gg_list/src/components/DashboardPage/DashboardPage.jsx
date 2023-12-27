// DashboardPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../AuthService/AuthService';

const DashboardPage = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        AuthService.logout();
        navigate.push('/login');
    };

    return (
        <div>
            <h2>Dashboard</h2>
            <p>Welcome to the dashboard!</p>
            <button type="button" onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
};

export default DashboardPage;
