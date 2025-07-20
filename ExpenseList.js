import React, { useState } from 'react';
import { Trash2, Filter } from 'lucide-react';

const ExpenseList = ({ expenses, onDeleteExpense }) => {
    const [filterCategory, setFilterCategory] = useState('All');
    const [sortBy, setSortBy] = useState('date');

    const categories = ['All', 'Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Education', 'Other'];

    const filteredExpenses = expenses
        .filter(expense => filterCategory === 'All' || expense.category === filterCategory)
        .sort((a, b) => {
            if (sortBy === 'date') return new Date(b.date) - new Date(a.date);
            if (sortBy === 'amount') return b.amount - a.amount;
            return a.description.localeCompare(b.description);
        });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className="card">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                <h2 className="card-title">📋 Recent Expenses</h2>
                <div className="filter-controls">
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                    >
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="date">Sort by Date</option>
                        <option value="amount">Sort by Amount</option>
                        <option value="description">Sort by Description</option>
                    </select>
                </div>
            </div>

            {filteredExpenses.length === 0 ? (
                <div className="empty-state">No expenses found</div>
            ) : (
                <div>
                    {filteredExpenses.map(expense => (
                        <div key={expense.id} className="expense-item">
                            <div className="expense-details">
                                <h3>{expense.description}</h3>
                                <div className="expense-meta">
                                    {expense.category} • {formatDate(expense.date)}
                                </div>
                            </div>
                            <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                                <span className="expense-amount">
                                    ${expense.amount.toFixed(2)}
                                </span>
                                <button
                                    onClick={() => onDeleteExpense(expense.id)}
                                    className="btn btn-danger"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ExpenseList;