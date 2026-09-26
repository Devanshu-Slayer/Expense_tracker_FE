import { formatCurrency, formatDate, categoryIcons } from '../utils/calculations'

function TransactionItem({ transaction, onDelete, onEdit }) {
  const { id, title, amount, type, category, date, description } = transaction

  const icon = categoryIcons[category] || '📦'

  return (
    <div className={`transaction-item transaction-item--${type}`}>
      <div className="transaction-item__left">
        <div className="transaction-item__icon-wrap">
          <span className="transaction-item__icon">{icon}</span>
        </div>

        <div className="transaction-item__details">
          <p className="transaction-item__title">{title}</p>
          <div className="transaction-item__meta">
            <span className="transaction-item__category badge badge--{type}">
              {category}
            </span>
            <span className="transaction-item__date">{formatDate(date)}</span>
          </div>
          {description && (
            <p className="transaction-item__description">{description}</p>
          )}
        </div>
      </div>

      <div className="transaction-item__right">
        <p className={`transaction-item__amount transaction-item__amount--${type}`}>
          {type === 'income' ? '+' : '-'}
          {formatCurrency(amount)}
        </p>

        <div className="transaction-item__actions">
          <button
            className="btn-icon btn-icon--edit"
            onClick={() => onEdit(id)}
            title="Edit transaction"
            aria-label={`Edit ${title}`}
            id={`edit-btn-${id}`}
          >
            ✏️
          </button>

          <button
            className="btn-icon btn-icon--delete"
            onClick={() => onDelete(id)}
            title="Delete transaction"
            aria-label={`Delete ${title}`}
            id={`delete-btn-${id}`}
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  )
}

export default TransactionItem
