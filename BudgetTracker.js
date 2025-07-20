import React, { useState } from 'react';
import { Target, AlertTriangle, CheckCircle } from 'lucide-react';

const BudgetTracker = ({ budgets, expenses, onUpdateBudget }) => {
    const [showBudgetForm, setShowBudgetForm] = useState(false);
    const [budgetForm, setBudgetForm] = useState({ category: 'Food', amount: '' });

    const categories = ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Education', 'Other'];

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

    const handleBudgetSubmit = (e) => {
        e.preventDefault();
        if (budgetForm.amount) {
            onUpdateBudget(budgetForm.category, parseFloat(budgetForm.amount));
            setBudgetForm({ category: 'Food', amount: '' });
            setShowBudgetForm(false);
        }
    };

    const getBudgetStatus = (category, spent, budget) => {
        const percentage = (spent / budget) * 100;
        if (percentage >= 100) return { status: 'over', color: 'red', icon: AlertTriangle };
        if (percentage >= 80) return { status: 'warning', color: 'yellow', icon: AlertTriangle };
        return { status: 'good', color: 'green', icon: CheckCircle };
    };

    return (
        <div className="card">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                <h2 className="card-title">🎯 Budget Tracker</h2>
                <button
                    onClick={() => setShowBudgetForm(!showBudgetForm)}
                    className="btn btn-success"
                    style={{fontSize: '0.875rem'}}
                >
                    {showBudgetForm ? 'Cancel' : 'Set Budget'}
                </button>
            </div>

            {showBudgetForm && (
                <form onSubmit={handleBudgetSubmit} className="budget-form">
                    <div className="budget-form-grid">
                        <select
                            value={budgetForm.category}
                            onChange={(e) => setBudgetForm({ ...budgetForm, category: e.target.value })}
                            className="form-select"
                            style={{fontSize: '0.875rem'}}
                        >
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                        <input
                            type="number"
                            placeholder="Budget amount"
                            value={budgetForm.amount}
                            onChange={(e) => setBudgetForm({ ...budgetForm, amount: e.target.value })}
                            className="form-input"
                            style={{fontSize: '0.875rem'}}
                            step="0.01"
                            min="0"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary btn-full"
                        style={{fontSize: '0.875rem'}}
                    >
                        Set Budget
                    </button>
                </form>
            )}

            {Object.keys(budgets).length === 0 ? (
                <div className="empty-state">No budgets set yet</div>
            ) : (
                <div>
                    {Object.entries(budgets).map(([category, budget]) => {
                        const spent = monthlyExpensesByCategory[category] || 0;
                        const { status, color } = getBudgetStatus(category, spent, budget);
                        const percentage = Math.min((spent / budget) * 100, 100);

                        return (
                            <div key={category} className="budget-item">
                                <div className="budget-header">
                                    <div className="budget-category">
                                        <span style={{color: status === 'over' ? '#e53e3e' : status === 'warning' ? '#ed8936' : '#48bb78'}}>
                                            {status === 'over' ? '⚠️' : status === 'warning' ? '⚠️' : '✅'}
                                        </span>
                                        <span>{category}</span>
                                    </div>
                                    <span className="budget-amounts">
                                        ${spent.toFixed(2)} / ${budget.toFixed(2)}
                                    </span>
                                </div>
                                <div className="budget-progress">
                                    <div className="progress-bar">
                                        <div
                                            className={`progress-fill ${status}`}
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="budget-footer">
                                    <span>{percentage.toFixed(1)}% used</span>
                                    <span>${(budget - spent).toFixed(2)} remaining</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default BudgetTracker;