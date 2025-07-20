import React from 'react';

const ExpenseSummary = ({ expenses }) => {
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

    return (
        <div style={{marginBottom: '1.5rem'}}>
            <div className="summary-grid">
                <div className="summary-card">
                    <div className="summary-icon blue">
                        💰
                    </div>
                    <div className="summary-content">
                        <h3>Total Expenses</h3>
                        <p>${totalExpenses.toFixed(2)}</p>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="summary-icon green">
                        📅
                    </div>
                    <div className="summary-content">
                        <h3>This Month</h3>
                        <p>${monthlyExpenses.toFixed(2)}</p>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="summary-icon purple">
                        📈
                    </div>
                    <div className="summary-content">
                        <h3>Top Category</h3>
                        <p>{topCategory ? topCategory[0] : 'None'}</p>
                        <div style={{fontSize: '0.875rem', color: '#718096'}}>
                            {topCategory ? `$${topCategory[1].toFixed(2)}` : '$0.00'}
                        </div>
                    </div>
                </div>
            </div>

            {Object.keys(categoryTotals).length > 0 && (
                <div className="card">
                    <h3 className="card-title">📊 Spending by Category</h3>
                    <div>
                        {Object.entries(categoryTotals)
                            .sort(([, a], [, b]) => b - a)
                            .map(([category, amount]) => {
                                const percentage = (amount / totalExpenses) * 100;
                                return (
                                    <div key={category} className="category-bar">
                                        <span className="category-name">
                                            {category}
                                        </span>
                                        <div className="progress-container">
                                            <div className="progress-bar">
                                                <div
                                                    className="progress-fill"
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="category-amount">
                                            <div className="amount">
                                                ${amount.toFixed(2)}
                                            </div>
                                            <div className="percentage">
                                                ({percentage.toFixed(1)}%)
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExpenseSummary;