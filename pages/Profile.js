import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [profileData, setProfileData] = useState({
        name: user.name,
        email: user.email
    });

    const handleProfileUpdate = (e) => {
        e.preventDefault();
        // In a real app, this would update the user profile via API
        const updatedUser = { ...user, ...profileData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        alert('Profile updated successfully!');
    };

    const handleDataExport = () => {
        const expenses = JSON.parse(localStorage.getItem(`expenses_${user.id}`) || '[]');
        const budgets = JSON.parse(localStorage.getItem(`budgets_${user.id}`) || '{}');
        
        const data = {
            user: user,
            expenses: expenses,
            budgets: budgets,
            exportDate: new Date().toISOString()
        };

        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `expense-data-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    };

    const handleDataClear = () => {
        if (window.confirm('Are you sure you want to clear all your data? This action cannot be undone.')) {
            localStorage.removeItem(`expenses_${user.id}`);
            localStorage.removeItem(`budgets_${user.id}`);
            alert('All data has been cleared.');
        }
    };

    const expenses = JSON.parse(localStorage.getItem(`expenses_${user.id}`) || '[]');
    const budgets = JSON.parse(localStorage.getItem(`budgets_${user.id}`) || '{}');
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Profile & Settings</h1>
                <p>Manage your account and application preferences</p>
            </div>

            <div className="profile-container">
                <div className="profile-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        👤 Profile
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
                        onClick={() => setActiveTab('stats')}
                    >
                        📊 Statistics
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'data' ? 'active' : ''}`}
                        onClick={() => setActiveTab('data')}
                    >
                        💾 Data Management
                    </button>
                </div>

                <div className="tab-content">
                    {activeTab === 'profile' && (
                        <div className="profile-section">
                            <div className="profile-card">
                                <div className="profile-avatar">
                                    <div className="avatar-circle">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                                
                                <form onSubmit={handleProfileUpdate} className="profile-form">
                                    <div className="form-group">
                                        <label className="form-label">Full Name</label>
                                        <input
                                            type="text"
                                            value={profileData.name}
                                            onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                                            className="form-input"
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label className="form-label">Email Address</label>
                                        <input
                                            type="email"
                                            value={profileData.email}
                                            onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                                            className="form-input"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Member Since</label>
                                        <input
                                            type="text"
                                            value={new Date(user.createdAt).toLocaleDateString()}
                                            className="form-input"
                                            disabled
                                        />
                                    </div>

                                    <button type="submit" className="btn btn-primary">
                                        Update Profile
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {activeTab === 'stats' && (
                        <div className="stats-section">
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <div className="stat-icon">📝</div>
                                    <div className="stat-info">
                                        <h3>Total Expenses</h3>
                                        <p>{expenses.length}</p>
                                    </div>
                                </div>

                                <div className="stat-card">
                                    <div className="stat-icon">💰</div>
                                    <div className="stat-info">
                                        <h3>Total Amount</h3>
                                        <p>${totalExpenses.toFixed(2)}</p>
                                    </div>
                                </div>

                                <div className="stat-card">
                                    <div className="stat-icon">🎯</div>
                                    <div className="stat-info">
                                        <h3>Active Budgets</h3>
                                        <p>{Object.keys(budgets).length}</p>
                                    </div>
                                </div>

                                <div className="stat-card">
                                    <div className="stat-icon">📅</div>
                                    <div className="stat-info">
                                        <h3>Days Active</h3>
                                        <p>{Math.ceil((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24))}</p>
                                    </div>
                                </div>
                            </div>

                            {expenses.length > 0 && (
                                <div className="expense-trends">
                                    <h3>Recent Activity</h3>
                                    <div className="trend-list">
                                        {expenses
                                            .sort((a, b) => new Date(b.date) - new Date(a.date))
                                            .slice(0, 5)
                                            .map(expense => (
                                                <div key={expense.id} className="trend-item">
                                                    <span className="trend-description">{expense.description}</span>
                                                    <span className="trend-amount">${expense.amount.toFixed(2)}</span>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'data' && (
                        <div className="data-section">
                            <div className="data-actions">
                                <div className="action-card">
                                    <h3>📤 Export Data</h3>
                                    <p>Download all your expenses and budgets as a JSON file</p>
                                    <button onClick={handleDataExport} className="btn btn-secondary">
                                        Export Data
                                    </button>
                                </div>

                                <div className="action-card">
                                    <h3>🗑️ Clear Data</h3>
                                    <p>Remove all expenses and budgets from your account</p>
                                    <button onClick={handleDataClear} className="btn btn-danger">
                                        Clear All Data
                                    </button>
                                </div>

                                <div className="action-card">
                                    <h3>🚪 Sign Out</h3>
                                    <p>Sign out of your account on this device</p>
                                    <button onClick={logout} className="btn btn-secondary">
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;