import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        logout();
        setIsMobileMenuOpen(false);
    };

    if (!user) {
        return (
            <nav className="navbar">
                <div className="nav-container">
                    <Link to="/" className="nav-logo">
                        💰 ExpenseTracker
                    </Link>
                    <div className="nav-links">
                        <Link 
                            to="/login" 
                            className={`nav-link ${isActive('/login') ? 'active' : ''}`}
                        >
                            Login
                        </Link>
                        <Link 
                            to="/register" 
                            className={`nav-link ${isActive('/register') ? 'active' : ''}`}
                        >
                            Register
                        </Link>
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/dashboard" className="nav-logo">
                    💰 ExpenseTracker
                </Link>
                
                <div className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
                    <Link 
                        to="/dashboard" 
                        className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Dashboard
                    </Link>
                    <Link 
                        to="/add-expense" 
                        className={`nav-link ${isActive('/add-expense') ? 'active' : ''}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Add Expense
                    </Link>
                    <Link 
                        to="/expenses" 
                        className={`nav-link ${isActive('/expenses') ? 'active' : ''}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        History
                    </Link>
                    <Link 
                        to="/budgets" 
                        className={`nav-link ${isActive('/budgets') ? 'active' : ''}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Budgets
                    </Link>
                    <Link 
                        to="/profile" 
                        className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Profile
                    </Link>
                    <button 
                        onClick={handleLogout}
                        className="nav-link logout-btn"
                    >
                        Logout
                    </button>
                </div>

                <div 
                    className="nav-toggle"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;