import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Header.css'; // Adjust the path if necessary

const Header = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const tokenKey = "token";

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem(tokenKey);
            if (token) {
                try {
                    const response = await axios.get("http://localhost:3350/api/user/profile", {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setUser(response.data);
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    // If token is invalid or expired, log the user out:
                    if (error.response && error.response.status === 401) {
                        localStorage.removeItem(tokenKey);
                        setUser(null);  // Important: Update user state
                    }
                }
            }
        };

        fetchUserData();
    }, [navigate]);


    const handleLogout = () => {
        localStorage.removeItem(tokenKey);
        setUser(null); // Update user state immediately
        navigate("/login", { replace: true });
    };

    return (
        <header className="header"> {/* Add a CSS class for styling */}
            <nav>
                <ul>
                    {user ? ( // Conditional rendering based on login status
                        <>
                            <li>
                                <Link to="/profile">Profile ({user.name})</Link> {/* Link to profile */}
                            </li>
                            <li>
                                <Link to="/create-card">Create Card</Link>
                            </li>
                            <li>
                                <Link to="/cases">Cases</Link> {/* Assuming you have a /cases route */}
                            </li>
                            <li>
                                <button onClick={handleLogout}>Logout</button>
                            </li>


                        </>

                    ) : (

                        <>
                            <li><Link to="/login">Login</Link></li>
                            <li><Link to="/register">Register</Link></li>

                        </>

                    )}


                </ul>
            </nav>

        </header>
    );

};



export default Header;