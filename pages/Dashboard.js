import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();
    const [expenses, setExpenses] = useState([]);
    const [budgets, setBudgets] = useState({});

    useEffect(() => {
        // Load user-specific data
        const userExpenses = localStorage.getItem(`expenses_${user.id}`);
        const userBudgets = localStorage.getItem(`budgets_${user.id}`);
        
        if (userExpenses) {
            setExpenses(JSON.parse(userExpenses));
        }
        if (userBudgets) {
            setBudgets(JSON.parse(userBudgets));
        }
    }, [user.id]);

    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    }).reduce((sum, expense) => sum + expense.amount, 0);

    const categoryTotals = expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
    }, {});

    const topCategory = Object.entries(categoryTotals).sort(([, a], [, b]) => b - a)[0];

    const recentExpenses = expenses
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

    const totalBudget = Object.values(budgets).reduce((sum, budget) => sum + budget, 0);

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Welcome back, {user.name}! 👋</h1>
                <p>Here's your financial overview</p>
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-stats">
                    <div className="stat-card">
                        <div className="stat-icon blue">💰</div>
                        <div className="stat-content">
                            <h3>Total Expenses</h3>
                            <p>${totalExpenses.toFixed(2)}</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon green">📅</div>
                        <div className="stat-content">
                            <h3>This Month</h3>
                            <p>${monthlyExpenses.toFixed(2)}</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon purple">📊</div>
                        <div className="stat-content">
                            <h3>Total Budget</h3>
                            <p>${totalBudget.toFixed(2)}</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon orange">🏆</div>
                        <div className="stat-content">
                            <h3>Top Category</h3>
                            <p>{topCategory ? topCategory[0] : 'None'}</p>
                            <small>{topCategory ? `$${topCategory[1].toFixed(2)}` : '$0.00'}</small>
                        </div>
                    </div>
                </div>

                <div className="dashboard-actions">
                    <div className="action-card">
                        <h3>Quick Actions</h3>
                        <div className="action-buttons">
                            <Link to="/add-expense" className="btn btn-primary">
                                ➕ Add Expense
                            </Link>
                            <Link to="/budgets" className="btn btn-success">
                                🎯 Manage Budgets
                            </Link>
                            <Link to="/expenses" className="btn btn-secondary">
                                📋 View History
                            </Link>
                        </div>
                    </div>
                </div>

                {recentExpenses.length > 0 && (
                    <div className="recent-expenses">
                        <div className="section-header">
                            <h3>Recent Expenses</h3>
                            <Link to="/expenses" className="view-all-link">View All</Link>
                        </div>
                        <div className="expense-list">
                            {recentExpenses.map(expense => (
                                <div key={expense.id} className="expense-item-mini">
                                    <div className="expense-info">
                                        <h4>{expense.description}</h4>
                                        <p>{expense.category} • {new Date(expense.date).toLocaleDateString()}</p>
                                    </div>
                                    <div className="expense-amount">
                                        ${expense.amount.toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {Object.keys(categoryTotals).length > 0 && (
                    <div className="category-overview">
                        <h3>Spending by Category</h3>
                        <div className="category-chart">
                            {Object.entries(categoryTotals)
                                .sort(([, a], [, b]) => b - a)
                                .slice(0, 5)
                                .map(([category, amount]) => {
                                    const percentage = (amount / totalExpenses) * 100;
                                    return (
                                        <div key={category} className="category-bar">
                                            <span className="category-name">{category}</span>
                                            <div className="progress-container">
                                                <div className="progress-bar">
                                                    <div
                                                        className="progress-fill"
                                                        style={{ width: `${percentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <span className="category-amount">
                                                ${amount.toFixed(2)}
                                            </span>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;