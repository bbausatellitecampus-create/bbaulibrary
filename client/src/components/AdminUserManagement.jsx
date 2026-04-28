import React, { useEffect, useState, useRef, useCallback } from 'react';
import API from '../api';
import Webcam from 'react-webcam';

const AdminUserManagement = () => {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    // Camera States
    const [showCamera, setShowCamera] = useState(false);
    const [facingMode, setFacingMode] = useState("user");
    const [userToUpdatePhoto, setUserToUpdatePhoto] = useState(null);
    const webcamRef = useRef(null);

    const toggleCamera = () => {
        setFacingMode(prevMode => prevMode === "user" ? "environment" : "user");
    };

    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: facingMode
    };

    const fetchUsers = async () => {
        setLoading(true);
        setMessage('');
        setError('');
        try {
            const res = await API.get('/api/users');
            const sortedUsers = res.data.sort((a, b) => {
                if (a.role === 'admin' && b.role !== 'admin') return -1;
                if (a.role !== 'admin' && b.role === 'admin') return 1;
                return 0;
            });
            setUsers(sortedUsers);
        } catch (err) {
            setError('Error fetching user records.');
            console.error("Admin User Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleUpdate = async (userId, newRole, userName) => {
        if (newRole !== 'student' && newRole !== 'admin') return;
        const confirmed = window.confirm(`Confirm changing ${userName}'s role to ${newRole.toUpperCase()}?`);
        if (!confirmed) return;

        setMessage(`Updating ${userName} role...`);
        setError('');
        try {
            await API.put(`/api/users/${userId}`, { role: newRole });
            setMessage(`Successfully updated ${userName}'s role to ${newRole}.`);
            fetchUsers();
        } catch (err) {
            setError(`Failed to update role: ${err.response?.data?.msg || 'An unknown error occurred.'}`);
        }
    };

    const handleDelete = async (userId, userName) => {
        const confirmed = window.confirm(`WARNING: Are you sure you want to DELETE ${userName}? This action cannot be undone. All data including profile photos will be purged.`);
        if (!confirmed) return;

        setMessage(`Deleting ${userName}...`);
        setError('');
        try {
            await API.delete(`/api/users/${userId}`);
            setMessage(`Successfully deleted user ${userName} and purged all associated data.`);
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.msg || 'Error deleting user.');
        }
    };

    const capture = useCallback(async () => {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc && userToUpdatePhoto) {
            setMessage(`Updating photo for ${userToUpdatePhoto.name}...`);
            setShowCamera(false);
            try {
                await API.put(`/api/users/${userToUpdatePhoto._id}`, { profilePhoto: imageSrc });
                setMessage(`Successfully updated photo for ${userToUpdatePhoto.name}.`);
                fetchUsers();
            } catch (err) {
                setError(`Failed to update photo: ${err.response?.data?.msg || 'Error uploading'}`);
            } finally {
                setUserToUpdatePhoto(null);
            }
        }
    }, [webcamRef, userToUpdatePhoto]);

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.libraryCardNo.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getRoleClasses = (role) =>
        role === 'admin'
            ? 'bg-red-200 text-red-800 border-red-400'
            : 'bg-gray-200 text-gray-700 border-gray-400';

    if (loading) {
        return <div className="text-center py-10 text-gray-500">Loading user accounts...</div>;
    }

    return (
        <div className="p-4">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 text-center sm:text-left">User Account Management</h3>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="Search by Name or Card No..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 w-full sm:w-64"
                    />
                    <button
                        onClick={fetchUsers}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-150"
                    >
                        Refresh
                    </button>
                </div>
            </div>

            {message && <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">{message}</div>}
            {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}

            <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name / Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Library Card</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dept / Sem</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.map(user => {
                            const isExpired = user.expiryDate && new Date(user.expiryDate) < new Date();
                            return (
                                <tr key={user._id} className={`${isExpired ? 'bg-red-50' : 'hover:bg-gray-50'}`}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 cursor-pointer" onClick={() => setSelectedPhoto(user.profilePhoto)}>
                                                {user.profilePhoto ? (
                                                    <img className="h-10 w-10 rounded-full object-cover border border-gray-200 hover:opacity-80 transition duration-150" src={user.profilePhoto} alt="" title="Click to enlarge" />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold border border-gray-200">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.libraryCardNo || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.department || 'N/A'} / {user.semester || 'N/A'}
                                    </td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${isExpired ? 'text-red-600' : 'text-gray-500'}`}>
                                        {user.expiryDate ? new Date(user.expiryDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'N/A'}
                                        {isExpired && <span className="block text-[10px] uppercase">Expired</span>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 rounded-full border ${getRoleClasses(user.role)}`}>
                                            {user.role.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-y-1 sm:space-y-0 sm:space-x-2 text-center">
                                        <div className="flex flex-col sm:flex-row justify-center gap-1">
                                            <button
                                                onClick={() => { setUserToUpdatePhoto(user); setShowCamera(true); }}
                                                className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 py-1 px-2 rounded-md transition duration-150 text-xs font-bold"
                                            >
                                                Camera
                                            </button>
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleUpdate(user._id, e.target.value, user.name)}
                                                className="p-1 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 text-sm"
                                            >
                                                <option value="student">Student</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                            <button
                                                onClick={() => handleDelete(user._id, user.name)}
                                                className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 py-1 px-2 rounded-md transition duration-150 text-xs font-bold"
                                                disabled={user.role === 'admin'}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Camera Modal */}
            {showCamera && (
                <div className="fixed inset-0 flex items-center justify-center z-[70] p-4 backdrop-blur-md">
                    <div className="bg-white rounded-xl p-6 max-w-lg w-full">
                        <h4 className="text-lg font-bold mb-4 text-center">Update Photo for {userToUpdatePhoto?.name}</h4>
                        <div className="rounded-lg overflow-hidden border-4 border-gray-200 mb-4">
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                videoConstraints={videoConstraints}
                                className="w-full h-auto"
                            />
                        </div>
                        <div className="flex justify-center gap-4 flex-wrap">
                            <button
                                onClick={capture}
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition"
                            >
                                Capture & Save
                            </button>
                            <button
                                onClick={toggleCamera}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition"
                            >
                                Switch Camera
                            </button>
                            <button
                                onClick={() => { setShowCamera(false); setUserToUpdatePhoto(null); }}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-lg transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Image Enlargement Modal */}
            {selectedPhoto && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-[60] p-4 backdrop-blur-md"
                    onClick={() => setSelectedPhoto(null)}
                >
                    <div className="relative flex justify-center items-center animate-in zoom-in duration-300">
                        <img
                            src={selectedPhoto}
                            alt="Enlarged profile"
                            className="max-h-[90vh] max-w-full rounded-lg shadow-2xl object-contain"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <button
                            className="absolute top-2.5 right-2.5 text-white bg-black bg-opacity-30 hover:bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center text-3xl font-light transition-all shadow-lg"
                            onClick={() => setSelectedPhoto(null)}
                        >
                            &times;
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUserManagement;
