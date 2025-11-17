import React, { useEffect, useState } from 'react';
import API from '../api';
import useAuth from '../hooks/useAuth';

export default function MyIssues() {
    const [issues, setIssues] = useState([]);
    const [message, setMessage] = useState('');
    const { isLoggedIn } = useAuth(); // Ensure only logged-in users are here

    const fetchMyIssues = async () => {
        if (!isLoggedIn) return;
        setMessage('Loading your transactions...');
        try {
            // Call the secure route GET /api/issue/myissues
            const res = await API.get('/api/issues/myissues');
            setIssues(res.data);
            setMessage('');
        } catch (err) {
            setMessage('Failed to load transactions.');
            console.error(err);
        }
    };

    // Function to handle the return action
    const handleReturn = async (issueId, title) => {
        const confirmed = window.confirm(`Are you sure you want to initiate return for "${title}"?`);
        if (!confirmed) return;

        setMessage(`Processing return for "${title}"...`);
        try {
            // Call the secure return route PUT /api/issue/return/:id
            await API.put(`/api/issues/return/${issueId}`, {});
            setMessage(`Return successfully initiated for "${title}".`);
            fetchMyIssues(); // Refresh list
        } catch (err) {
            setMessage(err.response?.data?.msg || 'Return failed.');
        }
    };

    useEffect(() => {
        fetchMyIssues();
    }, [isLoggedIn]);

    // Format date utility
    const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString() : 'N/A';

    // Tailwind status colors
    const getStatusColor = (status) => {
        switch (status) {
            case 'issued': return 'bg-yellow-100 text-yellow-800';
            case 'requested': return 'bg-blue-100 text-blue-800';
            case 'returned': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="container mx-auto p-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6 border-b-2 border-red-600 pb-2">My Books & Requests</h2>

            {message && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{message}</div>}

            <div className="space-y-4">
                {issues.length === 0 ? (
                    <p className="text-lg text-gray-500">You have no active requests or issued books.</p>
                ) : (
                    issues.map(issue => (
                        <div key={issue._id} className="bg-white shadow-md rounded-lg p-5 flex justify-between items-center border-l-4 border-red-600">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">{issue.book?.title || 'Book Deleted'}</h3>
                                <p className="text-sm text-gray-600">Issued: {formatDate(issue.issueDate)}</p>
                                <p className="text-sm text-gray-600">Due: {formatDate(issue.dueDate)}</p>
                                {issue.fine > 0 && (
                                    <p className="text-md font-semibold text-red-600 mt-1">Fine Due: ₹{issue.fine.toFixed(2)}</p>
                                )}

                                {issue.status === 'returned' && (
                                    <p className="text-sm text-green-600">Due: {(issue.paidAmount)}</p>
                                )}
                            </div>

                            <div className="flex flex-col items-end space-y-2">
                                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${getStatusColor(issue.status)}`}>
                                    {issue.status.toUpperCase()}
                                </span>

                                {/* {issue.status === 'issued' && (
                                    <button
                                        onClick={() => handleReturn(issue._id, issue.book?.title)}
                                        className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-1 px-3 rounded-lg transition duration-150"
                                    >
                                        Initiate Return
                                    </button>
                                )} */}
                                {issue.status === 'requested' && (
                                    <p className="text-xs text-gray-500">Awaiting Librarian Approval</p>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}