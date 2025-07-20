import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const BudgetManager = () => {
    const { user } = useAuth();
    const [budgets, setBudgets] = useState({});
    const [expenses, setExpenses] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        category: 'Food',
        amount: ''
    });

    const categories = ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Education', 'Travel', 'Other'];

    useEffect(() => {
        const userBudgets = JSON.parse(
            localStorage.getItem(`budgets_${user.id}`) || '{}'
        );
        const userExpenses = JSON.parse(
            localStorage.getItem(`expenses_${user.id}`) || '[]'
        );
        setBudgets(userBudgets);
        setExpenses(userExpenses);
    }, [user.id]);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyExpensesByCategory = expenses
        .filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
        })
        .reduce((acc, expense) => {
            acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
            return acc;
        }, {});

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedBudgets = {
            ...budgets,
            [formData.category]: parseFloat(formData.amount)
        };
        setBudgets(updatedBudgets);
        localStorage.setItem(`budgets_${user.id}`, JSON.stringify(updatedBudgets));
        setFormData({ category: 'Food', amount: '' });
        setShowForm(false);
    };

    const deleteBudget = (category) => {
        if (window.confirm(`Are you sure you want to delete the budget for ${category}?`)) {
            const updatedBudgets = { ...budgets };
            delete updatedBudgets[category];
            setBudgets(updatedBudgets);
            localStorage.setItem(`budgets_${user.id}`, JSON.stringify(updatedBudgets));
        }
    };

    const getBudgetStatus = (spent, budget) => {
        const percentage = (spent / budget) * 100;
        if (percentage >= 100) return { status: 'over', color: '#e53e3e', text: 'Over Budget' };
        if (percentage >= 80) return { status: 'warning', color: '#ed8936', text: 'Near Limit' };
        return { status: 'good', color: '#48bb78', text: 'On Track' };
    };

    const totalBudget = Object.values(budgets).reduce((sum, budget) => sum + budget, 0);
    const totalSpent = Object.values(monthlyExpensesByCategory).reduce((sum, spent) => sum + spent, 0);

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Budget Manager</h1>
                <p>Set and track your spending limits by category</p>
            </div>

            <div className="budget-overview">
                <div className="overview-stats">
                    <div className="overview-card">
                        <h3>Total Budget</h3>
                        <p className="amount">${totalBudget.toFixed(2)}</p>
                    </div>
                    <div className="overview-card">
                        <h3>Total Spent</h3>
                        <p className="amount">${totalSpent.toFixed(2)}</p>
                    </div>
                    <div className="overview-card">
                        <h3>Remaining</h3>
                        <p className={`amount ${totalSpent > totalBudget ? 'over' : 'good'}`}>
                            ${(totalBudget - totalSpent).toFixed(2)}
                        </p>
                    </div>
                </div>
            </div>

            <div className="budget-actions">
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn btn-primary"
                >
                    {showForm ? 'Cancel' : '➕ Add Budget'}
                </button>
            </div>

            {showForm && (
                <div className="budget-form-container">
                    <form onSubmit={handleSubmit} className="budget-form">
                        <h3>Set Category Budget</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="form-select"
                                >
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Monthly Budget ($)</label>
                                <input
                                    type="number"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    className="form-input"
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-success">
                            Set Budget
                        </button>
                    </form>
                </div>
            )}

            <div className="budgets-container">
                {Object.keys(budgets).length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">🎯</div>
                        <h3>No budgets set</h3>
                        <p>Create your first budget to start tracking your spending limits.</p>
                    </div>
                ) : (
                    <div className="budgets-grid">
                        {Object.entries(budgets).map(([category, budget]) => {
                            const spent = monthlyExpensesByCategory[category] || 0;
                            const { status, color, text } = getBudgetStatus(spent, budget);
                            const percentage = Math.min((spent / budget) * 100, 100);

                            return (
                                <div key={category} className="budget-card">
                                    <div className="budget-header">
                                        <h3 className="budget-category">{category}</h3>
                                        <button
                                            onClick={() => deleteBudget(category)}
                                            className="delete-budget-btn"
                                            title="Delete budget"
                                        >
                                            🗑️
                                        </button>
                                    </div>

                                    <div className="budget-amounts">
                                        <div className="amount-row">
                                            <span>Spent:</span>
                                            <span className="spent-amount">${spent.toFixed(2)}</span>
                                        </div>
                                        <div className="amount-row">
                                            <span>Budget:</span>
                                            <span className="budget-amount">${budget.toFixed(2)}</span>
                                        </div>
                                        <div className="amount-row">
                                            <span>Remaining:</span>
                                            <span className={`remaining-amount ${status}`}>
                                                ${(budget - spent).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="budget-progress">
                                        <div className="progress-bar">
                                            <div
                                                className={`progress-fill ${status}`}
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                        <div className="progress-info">
                                            <span className="progress-percentage">
                                                {percentage.toFixed(1)}% used
                                            </span>
                                            <span className={`progress-status ${status}`}>
                                                {text}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BudgetManager;