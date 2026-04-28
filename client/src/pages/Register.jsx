import React, { useState, useRef, useCallback } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        libraryCardNo: '',
        phone: '',
        department: '',
        semester: '',
        academicSession: '',
        role: 'student',
    });
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [message, setMessage] = useState('');
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [facingMode, setFacingMode] = useState("user");
    const webcamRef = useRef(null);
    const navigate = useNavigate();

    const toggleCamera = () => {
        setFacingMode(prevMode => prevMode === "user" ? "environment" : "user");
    };

    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: facingMode
    };

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setProfilePhoto(imageSrc);
        setIsCameraOpen(false);
    }, [webcamRef]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Academic Session Validation (xxxx-xxxx)
        const sessionRegex = /^\d{4}-\d{4}$/;
        if (!sessionRegex.test(formData.academicSession)) {
            setMessage('Academic Session must follow the format YYYY-YYYY (e.g., 2023-2027)');
            return;
        }

        if (!profilePhoto) {
            setMessage('Please capture a profile photo.');
            return;
        }
        setMessage('Registering...');
        try {
            const res = await API.post('/api/users/register', { ...formData, profilePhoto });
            setMessage('Registration successful! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (err) {
            setMessage(err.response?.data?.error || err.response?.data?.msg || 'Registration failed. Please check your details.');
        }
    };

    return (
        <div className="container mx-auto p-8 max-w-lg">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Register</h2>
            <p className="text-red-600 text-center mb-4 font-medium">{message}</p>
            <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-xl p-8 space-y-4 auth-form">
                
                <div className="flex flex-col items-center mb-4">
                    {profilePhoto ? (
                        <div className="relative">
                            <img src={profilePhoto} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-red-500 shadow-lg" />
                            <button 
                                type="button" 
                                onClick={() => setIsCameraOpen(true)}
                                className="absolute bottom-0 right-0 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition"
                            >
                                📷
                            </button>
                        </div>
                    ) : (
                        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-dashed border-gray-400">
                            {!isCameraOpen && (
                                <button 
                                    type="button" 
                                    onClick={() => setIsCameraOpen(true)}
                                    className="text-gray-600 font-semibold"
                                >
                                    Take Photo
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {isCameraOpen && (
                    <div className="flex flex-col items-center space-y-2">
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={videoConstraints}
                            className="rounded-lg shadow-md w-full"
                        />
                        <div className="flex space-x-2">
                            <button 
                                type="button" 
                                onClick={capture}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold transition"
                            >
                                Capture Photo
                            </button>
                            <button 
                                type="button" 
                                onClick={toggleCamera}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold transition"
                            >
                                Switch Camera
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setIsCameraOpen(false)}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-bold transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

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
                    type="text"
                    name="academicSession"
                    placeholder="Academic Session (e.g., 2023-2027)"
                    value={formData.academicSession}
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
                >Register</button>
            </form>
        </div>
    );

}