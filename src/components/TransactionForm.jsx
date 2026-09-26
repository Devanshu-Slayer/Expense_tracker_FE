import { CATEGORIES, INCOME_CATEGORIES, EXPENSE_CATEGORIES, getTodayDate } from '../utils/calculations'

function TransactionForm({
  formData,
  onFormChange,
  onSubmit,
  onCancelEdit,
  isEditing,
  errors,
}) {
  const relevantCategories =
    formData.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit()
  }

  function handleChange(e) {
    const { name, value } = e.target
    onFormChange(name, value)
  }

  return (
    <div className="form-card">
      <div className="form-card__header">
        <h2 className="form-card__title">
          {isEditing ? '✏️ Edit Transaction' : '➕ Add Transaction'}
        </h2>
        {isEditing && (
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={onCancelEdit}
            id="cancel-edit-btn"
          >
            Cancel
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="form" noValidate>
        <div className="form-group form-group--full">
          <label className="form-label">Transaction Type</label>
          <div className="type-toggle">
            <button
              type="button"
              className={`type-toggle__btn ${formData.type === 'expense' ? 'type-toggle__btn--active type-toggle__btn--expense' : ''}`}
              onClick={() => onFormChange('type', 'expense')}
              id="type-expense-btn"
            >
              📉 Expense
            </button>
            <button
              type="button"
              className={`type-toggle__btn ${formData.type === 'income' ? 'type-toggle__btn--active type-toggle__btn--income' : ''}`}
              onClick={() => onFormChange('type', 'income')}
              id="type-income-btn"
            >
              📈 Income
            </button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="form-title" className="form-label">
            Title <span className="form-required">*</span>
          </label>
          <input
            type="text"
            id="form-title"
            name="title"
            className={`form-input ${errors.title ? 'form-input--error' : ''}`}
            placeholder="e.g. Monthly Salary, Grocery Shopping"
            value={formData.title}
            onChange={handleChange}
            maxLength={60}
          />
          {errors.title && (
            <span className="form-error">{errors.title}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="form-amount" className="form-label">
            Amount (₹) <span className="form-required">*</span>
          </label>
          <input
            type="number"
            id="form-amount"
            name="amount"
            className={`form-input ${errors.amount ? 'form-input--error' : ''}`}
            placeholder="0"
            value={formData.amount}
            onChange={handleChange}
            min="1"
            step="1"
          />
          {errors.amount && (
            <span className="form-error">{errors.amount}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="form-category" className="form-label">
            Category <span className="form-required">*</span>
          </label>
          <select
            id="form-category"
            name="category"
            className={`form-input ${errors.category ? 'form-input--error' : ''}`}
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Select category</option>
            {relevantCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <span className="form-error">{errors.category}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="form-date" className="form-label">
            Date <span className="form-required">*</span>
          </label>
          <input
            type="date"
            id="form-date"
            name="date"
            className={`form-input ${errors.date ? 'form-input--error' : ''}`}
            value={formData.date}
            onChange={handleChange}
            max={getTodayDate()}
          />
          {errors.date && (
            <span className="form-error">{errors.date}</span>
          )}
        </div>

        <div className="form-group form-group--full">
          <label htmlFor="form-description" className="form-label">
            Description{' '}
            <span className="form-optional">(optional)</span>
          </label>
          <textarea
            id="form-description"
            name="description"
            className="form-input form-textarea"
            placeholder="Add a note..."
            value={formData.description}
            onChange={handleChange}
            rows={2}
            maxLength={200}
          />
        </div>

        <div className="form-group form-group--full">
          <button
            type="submit"
            className={`btn btn--primary btn--full ${formData.type === 'income' ? 'btn--income' : 'btn--expense'}`}
            id="submit-transaction-btn"
          >
            {isEditing ? '💾 Save Changes' : '➕ Add Transaction'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default TransactionForm
