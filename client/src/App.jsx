// import React from 'react'
// import { Routes, Route, Link, useNavigate } from 'react-router-dom'
// import Home from './pages/Home'
// import Books from './pages/Books'
// import Login from './pages/Login'
// import Register from './pages/Register'
// // IMPORT the new hook
// import useAuth from './hooks/useAuth'

// export default function App(){
//     // Use the hook to get login status and logout function
//     const { isLoggedIn, userRole, handleLogout } = useAuth();
//     const navigate = useNavigate(); // Need useNavigate for redirecting after logout

//     const logout = () => {
//         handleLogout();
//         navigate('/login'); // Redirect to login page after logging out
//     };
    
//     // Pass the handleLogin function to the Login component
//     const LoginWithProps = (props) => <Login {...props} handleLogin={useAuth().handleLogin} />;
    
//     // We wrap the entire component with BrowserRouter to enable useNavigate
//     return (
//         <>
//             <nav className="nav">
//                 <Link to="/">Home</Link>
//                 <Link to="/books">Books</Link>
//                 {/* Conditional rendering for Auth links */}
//                 {!isLoggedIn ? (
//                     <>
//                         <Link to="/login">Login</Link>
//                         <Link to="/register">Register</Link>
//                     </>
//                 ) : (
//                     <>
//                         {/* Display the user's role */}
//                         <span className="nav-role">Role: {userRole}</span>
//                         {/* If user is logged in, show a Logout button */}
//                         <button onClick={logout} className="nav-button">
//                             Logout
//                         </button>
//                     </>
//                 )}
//             </nav>
//             <Routes>
//                 <Route path="/" element={<Home/>} />
//                 <Route path="/books" element={<Books/>} />
//                 {/* Use the component with props */}
//                 <Route path="/login" element={<LoginWithProps />} />
//                 <Route path="/register" element={<Register/>} />
//             </Routes>
//         </>
//     )
// }




import React from 'react'
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import Books from './pages/Books'
import Login from './pages/Login'
import Register from './pages/Register'
import LibrarianDashboard from './pages/LibrarianDashboard' // NEW IMPORT
import MyIssues from './pages/MyIssues' // NEW IMPORT
import useAuth from './hooks/useAuth'

export default function App(){
    const { isLoggedIn, userRole, handleLogout } = useAuth();
    const navigate = useNavigate();

    const logout = () => {
        handleLogout();
        navigate('/login');
    };
    
    const LoginWithProps = (props) => <Login {...props} handleLogin={useAuth().handleLogin} />;
    
    return (
        <>
            {/* Tailwind Classes applied to NAV and Links */}
            <nav className="flex justify-between items-center bg-gray-900 text-white p-4 shadow-lg">


                <div className="flex space-x-6">
                    <Link to="/" className="text-xl font-bold text-red-400 hover:text-red-300 transition duration-150">
                        BBAU Library
                    </Link>
                </div>

                <div className="flex space-x-4 items-center">
                    <Link to="/books" className="text-white hover:text-red-400 transition duration-150">
                        Search Books
                    </Link>
                    {/* Link only visible to Admin */}
                    {userRole === 'admin' && (
                        <Link to="/admin" className="text-red-400 font-semibold hover:text-white transition duration-150">
                            Admin Tools
                        </Link>
                    )}
                    {!isLoggedIn ? (
                        <>
                            <Link to="/login" className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 transition duration-150">Login</Link>
                            <Link to="/register" className="text-white hover:text-red-400 transition duration-150">Register</Link>
                        </>
                    ) : (
                        <>
                            {/* <span className="text-sm text-gray-400 hidden sm:block">Role: {userRole}</span> */}
                            {/* NEW LINK: Available to all authenticated users (Student/Faculty/Librarian) */}
                    {isLoggedIn && (
                        <Link to="/my-issues" className="text-white hover:text-red-400 transition duration-150">
                            My Issues
                        </Link>
                    )}
                            <button 
                                onClick={logout} 
                                className="px-3 py-1 rounded border border-red-600 text-red-400 hover:bg-red-600 hover:text-white transition duration-150"
                            >
                                Logout
                            </button>
                        </>
                    )}
        
                </div>
            </nav>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/books" element={<Books/>} />
                <Route path="/login" element={<LoginWithProps />} />
                <Route path="/register" element={<Register/>} />
                {/* NEW ROUTE */}
                <Route path="/admin" element={<LibrarianDashboard />} /> 
                {/* NEW ROUTE */}
                <Route path="/my-issues" element={<MyIssues />} />
            </Routes>
        </>
    )
}