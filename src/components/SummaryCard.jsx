import { formatCurrency } from '../utils/calculations'

function SummaryCard({ title, amount, count, type, icon }) {
  const displayValue = type === 'count' ? count : formatCurrency(amount)

  const cardClass = `summary-card summary-card--${type}`

  return (
    <div className={cardClass}>
      <div className="summary-card__icon-wrap">
        <span className="summary-card__icon">{icon}</span>
      </div>
      <div className="summary-card__content">
        <p className="summary-card__title">{title}</p>
        <p className="summary-card__amount">{displayValue}</p>
      </div>
      <div className="summary-card__glow" />
    </div>
  )
}

export default SummaryCard
