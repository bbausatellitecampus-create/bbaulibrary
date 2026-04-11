import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        libraryCardNo: '',
        phone: '',
        department: '',
        semester: '',
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
            // Note: The backend route is /api/users/register
            const res = await API.post('/api/users/register', formData);
            setMessage('Registration successful! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (err) {
            // Backend sends error in { error: '...' }
            setMessage(err.response?.data?.error || err.response?.data?.msg || 'Registration failed. Please check your details.');
        }
    };

    return (
        <div className="container mx-auto p-8 max-w-lg">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Register</h2>
            <p className="text-red-600 text-center mb-4 font-medium">{message}</p>
            <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-xl p-8 space-y-4 auth-form">
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                />
                <input
                    type="email"
                    name="email"
                    placeholder="College Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                />
                <input
                    type="text"
                    name="libraryCardNo"
                    placeholder="Library Card Number"
                    value={formData.libraryCardNo}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                />
                <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                />
                <input
                    type="text"
                    name="department"
                    placeholder="Department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                />
                <input
                    type="text"
                    name="semester"
                    placeholder="Semester"
                    value={formData.semester}
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
                {/* <select name="role" value={formData.role} onChange={handleChange}>
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                </select> */}
                <button 
                    type="submit" 
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition duration-150 shadow-md"
                >Register</button>
            </form>
        </div>
    );

}