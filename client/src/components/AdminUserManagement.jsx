import React, { useEffect, useState } from 'react';
import API from '../api';

const AdminUserManagement  = () => {
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        setLoading(true);
        setMessage('');
        setError('');
        try {
            // GET /api/users is protected and authorized for 'admin'
            const res = await API.get('/api/users'); 
            // Sort to show admin accounts first for visibility
            const sortedUsers = res.data.sort((a, b) => {
                if (a.role === 'admin' && b.role !== 'admin') return -1;
                if (a.role !== 'admin' && b.role === 'admin') return 1;
                return 0;
            });
            setUsers(sortedUsers);
        } catch (err) {
            setError('Error fetching user records. Ensure the backend is running.');
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
            // PUT /api/users/:id
            await API.put(`/api/users/${userId}`, { role: newRole }); 
            setMessage(`Successfully updated ${userName}'s role to ${newRole}.`);
            fetchUsers(); // Refresh the list
        } catch (err) {
            setError(`Failed to update role: ${err.response?.data?.msg || 'An unknown error occurred.'}`);
        }
    };

    const handleDelete = async (userId, userName) => {
        const confirmed = window.confirm(`WARNING: Are you sure you want to DELETE ${userName}? This action cannot be undone.`);
        if (!confirmed) return;

        setMessage(`Deleting ${userName}...`);
        setError('');
        try {
            // DELETE /api/users/:id
            await API.delete(`/api/users/${userId}`); 
            setMessage(`Successfully deleted user ${userName}.`);
            fetchUsers(); // Refresh the list
        } catch (err) {
            // Catch the specific error: user has an active issued book
            const errorMsg = err.response?.data?.msg || 'Error deleting user.';
            setError(errorMsg);
        }
    };

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
                <button
                    onClick={fetchUsers}
                    className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-150"
                >
                    Refresh Users
                </button>
            </div>
            
            {/* Messages */}
            {message && <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">{message}</div>}
            {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}

            <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name / Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Library Card</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dept / Sem</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map(user => (
                            <tr key={user._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                    <div className="text-sm text-gray-500">{user.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.libraryCardNo || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.department || 'N/A'} / {user.semester || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 rounded-full border ${getRoleClasses(user.role)}`}>
                                        {user.role.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2 text-center">
                                    {/* Role Change Dropdown */}
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleRoleUpdate(user._id, e.target.value, user.name)}
                                        className="p-1 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 text-sm"
                                    >
                                        <option value="student">Student</option>
                                        <option value="admin">Admin</option>
                                    </select>

                                    {/* Delete Button */}
                                    <button
                                        onClick={() => handleDelete(user._id, user.name)}
                                        className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 py-1 px-2 rounded-md transition duration-150 text-xs font-bold"
                                        disabled={user.role === 'admin'} // Cannot delete another admin for safety
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminUserManagement;