import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on app start
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
            try {
                setUser(JSON.parse(userData));
            } catch (error) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            // In a real app, this would be an API call
            // For demo purposes, we'll simulate authentication
            if (email && password) {
                const userData = {
                    id: Date.now(),
                    email: email,
                    name: email.split('@')[0],
                    createdAt: new Date().toISOString()
                };
                
                const token = 'demo_token_' + Date.now();
                
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
                
                return { success: true };
            }
            throw new Error('Invalid credentials');
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const register = async (name, email, password) => {
        try {
            // In a real app, this would be an API call
            if (name && email && password) {
                const userData = {
                    id: Date.now(),
                    email: email,
                    name: name,
                    createdAt: new Date().toISOString()
                };
                
                const token = 'demo_token_' + Date.now();
                
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
                
                return { success: true };
            }
            throw new Error('All fields are required');
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};