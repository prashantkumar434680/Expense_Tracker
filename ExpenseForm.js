import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const ExpenseForm = ({ onAddExpense }) => {
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        category: 'Food'
    });

    const categories = [
        'Food', 'Transportation', 'Entertainment', 'Shopping',
        'Bills', 'Healthcare', 'Education', 'Other'
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.description && formData.amount) {
            onAddExpense({
                description: formData.description,
                amount: parseFloat(formData.amount),
                category: formData.category
            });
            setFormData({ description: '', amount: '', category: 'Food' });
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="card">
            <h2 className="card-title">➕ Add Expense</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">
                        Description
                    </label>
                    <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter expense description"
                        className="form-input"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">
                        Amount ($)
                    </label>
                    <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        className="form-input"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">
                        Category
                    </label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="form-select"
                    >
                        {categories.map(category => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary btn-full"
                >
                    <Plus size={20} />
                    Add Expense
                </button>
            </form>
        </div>
    );
};

export default ExpenseForm;