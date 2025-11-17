import { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode'; // You'll need to install this library: npm install jwt-decode

const useAuth = () => {
    // State to track if the user is logged in
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // State to store the user's role
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Optional: Decode the token to get user info (like role)
            try {
                const decoded = jwtDecode(token);
                // Check if token is expired (if decoded.exp is present)
                if (decoded.exp * 1000 > Date.now()) {
                    setIsLoggedIn(true);
                    setUserRole(decoded.role);
                } else {
                    handleLogout(); // Log out if expired
                }
            } catch (error) {
                console.error("Invalid token:", error);
                handleLogout();
            }
        }
    }, []);

    const handleLogin = (token) => {
        localStorage.setItem('token', token);
        const decoded = jwtDecode(token);
        setIsLoggedIn(true);
        setUserRole(decoded.role);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUserRole(null);
    };

    return { isLoggedIn, userRole, handleLogin, handleLogout };
};

export default useAuth;