import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login({ handleLogin }) {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('Logging in...');
        try {
            // Note: The backend route is /api/auth/login
            const res = await API.post('/api/users/login', formData);
            
            // 1. Store the token (e.g., in localStorage)
            localStorage.setItem('token', res.data.token);
            navigate('/');
            window.location.reload(); // <-- refreshes the page fully
            
            // // 2. Redirect to the home page or dashboard
            // setTimeout(() => navigate('/'), 1500); 
            
        } catch (err) {
            setMessage(err.response?.data?.msg || 'Login failed. Check email/password.');
        }
    };

    return (
        <div className="container mx-auto p-8 max-w-lg">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Login</h2>
            {message && <p className="text-red-600 text-center mb-4 font-medium">{message}</p>}
            
            <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-xl p-8 space-y-4">
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                />
                <button 
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition duration-150 shadow-md"
                >
                    Sign In
                </button>
            </form>
        </div>
    );
}