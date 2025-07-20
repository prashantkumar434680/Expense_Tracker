import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AddExpense = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        category: 'Food',
        date: new Date().toISOString().split('T')[0]
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const categories = [
        'Food', 'Transportation', 'Entertainment', 'Shopping', 
        'Bills', 'Healthcare', 'Education', 'Travel', 'Other'
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const newExpense = {
                id: Date.now(),
                description: formData.description,
                amount: parseFloat(formData.amount),
                category: formData.category,
                date: formData.date,
                userId: user.id,
                createdAt: new Date().toISOString()
            };

            // Get existing expenses for this user
            const existingExpenses = JSON.parse(
                localStorage.getItem(`expenses_${user.id}`) || '[]'
            );

            // Add new expense
            const updatedExpenses = [...existingExpenses, newExpense];
            localStorage.setItem(`expenses_${user.id}`, JSON.stringify(updatedExpenses));

            setSuccess(true);
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);

        } catch (error) {
            console.error('Error adding expense:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFormData({
            description: '',
            amount: '',
            category: 'Food',
            date: new Date().toISOString().split('T')[0]
        });
        setSuccess(false);
    };

    if (success) {
        return (
            <div className="page-container">
                <div className="success-container">
                    <div className="success-icon">✅</div>
                    <h2>Expense Added Successfully!</h2>
                    <p>Your expense has been recorded and will appear in your dashboard.</p>
                    <div className="success-actions">
                        <button onClick={handleReset} className="btn btn-secondary">
                            Add Another Expense
                        </button>
                        <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
                            Go to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Add New Expense</h1>
                <p>Record your spending to keep track of your finances</p>
            </div>

            <div className="form-container">
                <form onSubmit={handleSubmit} className="expense-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Description *</label>
                            <input
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="What did you spend on?"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Amount ($) *</label>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Category *</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="form-select"
                                required
                            >
                                {categories.map(category => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Date *</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="form-input"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Adding Expense...' : 'Add Expense'}
                        </button>
                    </div>
                </form>

                <div className="expense-tips">
                    <h3>💡 Tips for Better Expense Tracking</h3>
                    <ul>
                        <li>Be specific with descriptions (e.g., "Lunch at Subway" vs "Food")</li>
                        <li>Add expenses as soon as possible to avoid forgetting</li>
                        <li>Choose the most appropriate category for better insights</li>
                        <li>Set up budgets to monitor your spending limits</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AddExpense;