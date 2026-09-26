function EmptyState({ type, onClearFilters }) {
  const isNoTransactions = type === 'no-transactions'

  return (
    <div className="empty-state">
      <div className="empty-state__icon">
        {isNoTransactions && <span>💸</span>}
        {!isNoTransactions && <span>🔍</span>}
      </div>

      <h3 className="empty-state__title">
        {isNoTransactions ? 'No transactions yet' : 'No results found'}
      </h3>

      <p className="empty-state__description">
        {isNoTransactions
          ? 'Add your first transaction using the form above to get started.'
          : 'No transactions match your current search or filters.'}
      </p>

      {!isNoTransactions && onClearFilters && (
        <button
          className="btn btn--secondary"
          onClick={onClearFilters}
          id="clear-filters-btn"
        >
          Clear Filters
        </button>
      )}
    </div>
  )
}

export default EmptyState
