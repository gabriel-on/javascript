// AuthService.js
import axios from 'axios';

const API_URL = 'http://localhost:8000';

const AuthService = {
  login: async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/users/login`, { username, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

export default AuthService;
