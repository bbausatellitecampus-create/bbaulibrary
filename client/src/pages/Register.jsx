import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student', // Default role for registration
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('Registering...');
        try {
            // Note: The backend route is /api/auth/register
            const res = await API.post('/api/users/register', formData);
            setMessage(res.data.msg + ' Redirecting to login...');
            navigate('/login');
        } catch (err) {
            setMessage(err.response?.data?.msg || 'Registration failed.');
        }
    };

    return (
        <div className="container">
            <h2>Register</h2>
            <p className="message">{message}</p>
            <form onSubmit={handleSubmit} className="auth-form">
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="College Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <select name="role" value={formData.role} onChange={handleChange}>
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    {/* Librarian accounts will typically be created by an admin and not via public register */}
                </select>
                <button type="submit">Register</button>
            </form>
        </div>
    );
}