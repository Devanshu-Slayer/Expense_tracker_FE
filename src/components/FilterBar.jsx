import { CATEGORIES } from '../utils/calculations'

function FilterBar({
  searchText,
  filterType,
  filterCategory,
  sortBy,
  onSearchChange,
  onTypeChange,
  onCategoryChange,
  onSortChange,
  onClearFilters,
}) {
  const hasActiveFilters =
    searchText !== '' ||
    filterType !== 'all' ||
    filterCategory !== 'all' ||
    sortBy !== 'newest'

  return (
    <div className="filter-bar">
      <div className="filter-bar__search">
        <span className="filter-bar__search-icon">🔍</span>
        <input
          type="text"
          className="filter-bar__input"
          placeholder="Search transactions..."
          value={searchText}
          onChange={(e) => onSearchChange(e.target.value)}
          id="search-input"
          aria-label="Search transactions"
        />
        {searchText && (
          <button
            className="filter-bar__clear-btn"
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      <div className="filter-bar__tabs" role="group" aria-label="Filter by type">
        {['all', 'income', 'expense'].map((type) => (
          <button
            key={type}
            className={`filter-tab ${filterType === type ? 'filter-tab--active' : ''}`}
            onClick={() => onTypeChange(type)}
            id={`filter-tab-${type}`}
          >
            {{ all: 'All', income: 'Income', expense: 'Expense' }[type]}
          </button>
        ))}
      </div>

      <div className="filter-bar__controls">
        <select
          className="filter-bar__select"
          value={filterCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          id="category-filter"
          aria-label="Filter by category"
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          className="filter-bar__select"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          id="sort-select"
          aria-label="Sort transactions"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="highest">Highest Amount</option>
          <option value="lowest">Lowest Amount</option>
        </select>

        {hasActiveFilters && (
          <button
            className="btn btn--ghost btn--sm"
            onClick={onClearFilters}
            id="clear-all-filters-btn"
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  )
}

export default FilterBar
