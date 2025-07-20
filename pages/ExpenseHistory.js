import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const ExpenseHistory = () => {
    const { user } = useAuth();
    const [expenses, setExpenses] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [filters, setFilters] = useState({
        category: 'All',
        sortBy: 'date',
        dateFrom: '',
        dateTo: '',
        search: ''
    });

    const categories = ['All', 'Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Education', 'Travel', 'Other'];

    useEffect(() => {
        const userExpenses = JSON.parse(
            localStorage.getItem(`expenses_${user.id}`) || '[]'
        );
        setExpenses(userExpenses);
        setFilteredExpenses(userExpenses);
    }, [user.id]);

    useEffect(() => {
        let filtered = [...expenses];

        // Category filter
        if (filters.category !== 'All') {
            filtered = filtered.filter(expense => expense.category === filters.category);
        }

        // Date range filter
        if (filters.dateFrom) {
            filtered = filtered.filter(expense => expense.date >= filters.dateFrom);
        }
        if (filters.dateTo) {
            filtered = filtered.filter(expense => expense.date <= filters.dateTo);
        }

        // Search filter
        if (filters.search) {
            filtered = filtered.filter(expense => 
                expense.description.toLowerCase().includes(filters.search.toLowerCase())
            );
        }

        // Sort
        filtered.sort((a, b) => {
            if (filters.sortBy === 'date') return new Date(b.date) - new Date(a.date);
            if (filters.sortBy === 'amount') return b.amount - a.amount;
            return a.description.localeCompare(b.description);
        });

        setFilteredExpenses(filtered);
    }, [expenses, filters]);

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const deleteExpense = (id) => {
        if (window.confirm('Are you sure you want to delete this expense?')) {
            const updatedExpenses = expenses.filter(expense => expense.id !== id);
            setExpenses(updatedExpenses);
            localStorage.setItem(`expenses_${user.id}`, JSON.stringify(updatedExpenses));
        }
    };

    const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Expense History</h1>
                <p>View and manage all your recorded expenses</p>
            </div>

            <div className="filters-section">
                <div className="filters-grid">
                    <div className="filter-group">
                        <label className="filter-label">Search</label>
                        <input
                            type="text"
                            name="search"
                            value={filters.search}
                            onChange={handleFilterChange}
                            className="filter-input"
                            placeholder="Search expenses..."
                        />
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">Category</label>
                        <select
                            name="category"
                            value={filters.category}
                            onChange={handleFilterChange}
                            className="filter-select"
                        >
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">Sort By</label>
                        <select
                            name="sortBy"
                            value={filters.sortBy}
                            onChange={handleFilterChange}
                            className="filter-select"
                        >
                            <option value="date">Date (Newest First)</option>
                            <option value="amount">Amount (Highest First)</option>
                            <option value="description">Description (A-Z)</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">From Date</label>
                        <input
                            type="date"
                            name="dateFrom"
                            value={filters.dateFrom}
                            onChange={handleFilterChange}
                            className="filter-input"
                        />
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">To Date</label>
                        <input
                            type="date"
                            name="dateTo"
                            value={filters.dateTo}
                            onChange={handleFilterChange}
                            className="filter-input"
                        />
                    </div>
                </div>

                <div className="filter-summary">
                    <span className="expense-count">
                        {filteredExpenses.length} expense{filteredExpenses.length !== 1 ? 's' : ''}
                    </span>
                    <span className="total-amount">
                        Total: ${totalAmount.toFixed(2)}
                    </span>
                </div>
            </div>

            <div className="expenses-container">
                {filteredExpenses.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📝</div>
                        <h3>No expenses found</h3>
                        <p>Try adjusting your filters or add some expenses to get started.</p>
                    </div>
                ) : (
                    <div className="expenses-list">
                        {filteredExpenses.map(expense => (
                            <div key={expense.id} className="expense-card">
                                <div className="expense-main">
                                    <div className="expense-details">
                                        <h3 className="expense-description">{expense.description}</h3>
                                        <div className="expense-meta">
                                            <span className="expense-category">{expense.category}</span>
                                            <span className="expense-date">
                                                {new Date(expense.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="expense-actions">
                                        <span className="expense-amount">${expense.amount.toFixed(2)}</span>
                                        <button
                                            onClick={() => deleteExpense(expense.id)}
                                            className="delete-btn"
                                            title="Delete expense"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExpenseHistory;