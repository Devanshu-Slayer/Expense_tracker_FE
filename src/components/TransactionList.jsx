import TransactionItem from './TransactionItem'
import EmptyState from './EmptyState'

function TransactionList({
  transactions,
  filteredTransactions,
  onDelete,
  onEdit,
  onClearFilters,
}) {
  const hasAnyTransactions = transactions.length > 0
  const hasFilteredResults = filteredTransactions.length > 0

  if (!hasAnyTransactions) {
    return <EmptyState type="no-transactions" />
  }

  if (!hasFilteredResults) {
    return <EmptyState type="no-results" onClearFilters={onClearFilters} />
  }

  return (
    <div className="transaction-list">
      <div className="transaction-list__header">
        <span className="transaction-list__count">
          {filteredTransactions.length}{' '}
          {filteredTransactions.length === 1 ? 'transaction' : 'transactions'}
        </span>
      </div>

      <div className="transaction-list__items">
        {filteredTransactions.map((transaction) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>
    </div>
  )
}

export default TransactionList
