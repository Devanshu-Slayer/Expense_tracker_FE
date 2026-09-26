import SummaryCard from './SummaryCard'
import {
  getTotalIncome,
  getTotalExpenses,
  getBalance,
} from '../utils/calculations'

function Summary({ transactions }) {
  const totalIncome = getTotalIncome(transactions)
  const totalExpenses = getTotalExpenses(transactions)
  const balance = getBalance(transactions)
  const totalCount = transactions.length

  return (
    <section className="summary">
      <SummaryCard
        title="Total Balance"
        amount={balance}
        type="balance"
        icon="⚖️"
      />
      <SummaryCard
        title="Total Income"
        amount={totalIncome}
        type="income"
        icon="📈"
      />
      <SummaryCard
        title="Total Expenses"
        amount={totalExpenses}
        type="expense"
        icon="📉"
      />
      <SummaryCard
        title="Transactions"
        count={totalCount}
        type="count"
        icon="📋"
      />
    </section>
  )
}

export default Summary
