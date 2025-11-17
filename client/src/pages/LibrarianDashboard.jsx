// import React, { useState } from 'react';
// import API from '../api';
// import useAuth from '../hooks/useAuth'; // To check role

// export default function LibrarianDashboard() {
//     // State for the JSON input (default example structure)
//     const [jsonInput, setJsonInput] = useState(`[
//     { "title": "Database Systems", "author": "Author X", "quantity": 3, "available": 3, "isbn": "978-0131495758", "category": "CS" },
//     { "title": "Networking Basics", "author": "Author Y", "quantity": 2, "available": 2, "isbn": "978-0130620023", "category": "IT" }
// ]`);
//     const [message, setMessage] = useState('');
//     const [error, setError] = useState('');
//     const { userRole } = useAuth(); // Get the current user role

//     // Only allow admins to view this page (Basic Frontend Guard)
//     if (userRole !== 'admin') {
//         return (
//             <div className="p-8 text-center bg-red-100 border-l-4 border-red-500 text-red-700">
//                 <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
//                 <p>You must be logged in as a **librarian** to access the dashboard.</p>
//             </div>
//         );
//     }

//     // const handleUpload = async (e) => {
//     //     e.preventDefault();
//     //     setMessage('Uploading books...');
//     //     setError('');
        
//     //     try {
//     //         // Attempt to parse the JSON input
//     //         const booksArray = JSON.parse(jsonInput);

//     //         if (!Array.isArray(booksArray) || booksArray.length === 0) {
//     //             setError('Invalid JSON format. Please provide an array of book objects.');
//     //             setMessage('');
//     //             return;
//     //         }
            
//     //         let uploadedCount = 0;
//     //         let failedCount = 0;
            
//     //         // Send each book individually to the protected backend route
//     //         // A more production-optimized way would be a new bulk POST route, but this works for now.
//     //         for (const book of booksArray) {
//     //             try {
//     //                 // This POST route is protected by `authorize('admin')`
//     //                 await API.post('/api/books', book);
//     //                 uploadedCount++;
//     //             } catch (e) {
//     //                 failedCount++;
//     //                 console.error(`Failed to upload book: ${book.title}`, e.response?.data?.msg || e.message);
//     //             }
//     //         }
            
//     //         setMessage(`Upload complete: ${uploadedCount} books added. ${failedCount} books failed (check console for details).`);
//     //         setJsonInput('[]'); // Clear input after successful attempt

//     //     } catch (err) {
//     //         setError('Failed to parse JSON input. Please check the syntax.');
//     //         setMessage('');
//     //     }
//     // };

//     const handleUpload = async (e) => {
//         e.preventDefault();
//         setMessage('Uploading books...');
//         setError('');
        
//         try {
//             const booksArray = JSON.parse(jsonInput);

//             if (!Array.isArray(booksArray) || booksArray.length === 0) {
//                 setError('Invalid JSON format. Please provide an array of book objects.');
//                 setMessage('');
//                 return;
//             }
            
//             // --- UPDATED LOGIC ---
//             // Send the entire array to the new bulk endpoint
//             const res = await API.post('/api/books/bulk', booksArray);
            
//             setMessage(res.data.msg);
            
//             // Check for partial success (HTTP 207)
//             if (res.status === 207) {
//                 setError(`Failed to insert ${res.data.failedCount} book(s). See console for details.`);
//                 console.error("Bulk Upload Failures:", res.data.failures);
//             }
            
//             setJsonInput('[]'); // Clear input after successful attempt

//         } catch (err) {
//             // Handle HTTP 400 (Bad Request) or 403 (Forbidden)
//             setError(err.response?.data?.msg || 'Failed to process upload. Check your JSON format.');
//             setMessage('');
//         }
//     };

//     return (
//         <div className="container mx-auto p-8">
//             <h2 className="text-3xl font-extrabold text-gray-900 border-b-2 border-red-600 pb-2 mb-6">
//                 Librarian Dashboard 📚
//             </h2>

//             <div className="bg-white shadow-xl rounded-lg p-6">
//                 <h3 className="text-2xl font-semibold text-gray-700 mb-4">Bulk Add Books (JSON)</h3>
                
//                 {message && <div className="bg-green-100 text-green-700 p-3 rounded-md mb-4 font-medium">{message}</div>}
//                 {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 font-medium">{error}</div>}

//                 <form onSubmit={handleUpload}>
//                     <label htmlFor="json-input" className="block text-sm font-medium text-gray-700 mb-2">
//                         Paste Books as JSON Array (Max 50 books per upload)
//                     </label>
//                     <textarea
//                         id="json-input"
//                         className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-red-500 focus:border-red-500 resize-none"
//                         rows="10"
//                         value={jsonInput}
//                         onChange={(e) => setJsonInput(e.target.value)}
//                         placeholder="[ { title: 'Book A', author: 'Author A', quantity: 1 } ]"
//                         required
//                     />
                    
//                     <button
//                         type="submit"
//                         className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-150 shadow-md"
//                     >
//                         Upload Books
//                     </button>
//                 </form>
//             </div>
            
//         </div>
//     );
// }



import React, { useState } from 'react';
import useAuth from '../hooks/useAuth'; 

// Import the sub-components we will create
import AdminBookUpload from '../components/AdminBookUpload';
import AdminUserManagement from '../components/AdminUserManagement';
import AdminIssueManagement from '../components/AdminIssueManagement';

export default function LibrarianDashboard() {
    const { userRole } = useAuth();
    // State to track which sub-page is active
    const [activeTab, setActiveTab] = useState('requests'); 

    // Authorization check
    if (userRole !== 'admin') {
        return (
            <div className="p-8 text-center bg-red-100 border-l-4 border-red-500 text-red-700">
                <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
                <p>You must be logged in as an **admin** to access this dashboard.</p>
            </div>
        );
    }

    // Function to render the active component
    const renderContent = () => {
        switch (activeTab) {
            case 'requests':
                return <AdminIssueManagement />; // Handles Approvals/Fines
            case 'books':
                return <AdminBookUpload />; // Handles Bulk Upload/Single Add
            case 'users':
                return <AdminUserManagement />; // Handles User CRUD
            default:
                return <AdminIssueManagement />;
        }
    };

    const tabClasses = (tabName) => 
        `px-6 py-3 text-center cursor-pointer font-semibold transition duration-150 
         ${activeTab === tabName 
            ? 'bg-red-600 text-white shadow-lg' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`;

    return (
        <div className="container mx-auto p-8">
            <h2 className="text-4xl font-extrabold text-gray-900 border-b-4 border-red-600 pb-3 mb-8">
                Admin Control Panel
            </h2>

            {/* Tab Navigation (Tailwind) */}
            <div className="flex bg-gray-50 rounded-xl shadow-inner overflow-hidden mb-8">
                <div className={tabClasses('requests')} onClick={() => setActiveTab('requests')}>
                    Issue Management
                </div>
                <div className={tabClasses('books')} onClick={() => setActiveTab('books')}>
                    Book Inventory & Upload
                </div>
                <div className={tabClasses('users')} onClick={() => setActiveTab('users')}>
                    User Accounts
                </div>
            </div>

            {/* Content Area */}
            <div className="bg-white shadow-2xl rounded-xl p-6 min-h-[600px]">
                {renderContent()}
            </div>
            
        </div>
    );
}