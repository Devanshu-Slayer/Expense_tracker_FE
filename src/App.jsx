import { useState } from 'react'
import AuthPage from './components/auth/AuthPage'
import Header from './components/Header'
import Summary from './components/Summary'
import TransactionForm from './components/TransactionForm'
import FilterBar from './components/FilterBar'
import TransactionList from './components/TransactionList'
import useLocalStorage from './hooks/useLocalStorage'
import { generateId, getTodayDate, EXPENSE_CATEGORIES } from './utils/calculations'

const INITIAL_FORM_DATA = {
  title: '',
  amount: '',
  type: 'expense',
  category: '',
  date: getTodayDate(),
  description: '',
}

const SAMPLE_TRANSACTIONS = [
  {
    id: 'sample-1',
    title: 'Monthly Salary',
    amount: 75000,
    type: 'income',
    category: 'Salary',
    date: '2026-09-01',
    description: 'September salary credit',
  },
  {
    id: 'sample-2',
    title: 'Grocery Shopping',
    amount: 3200,
    type: 'expense',
    category: 'Food',
    date: '2026-09-05',
    description: 'Big Bazaar monthly groceries',
  },
  {
    id: 'sample-3',
    title: 'Netflix Subscription',
    amount: 649,
    type: 'expense',
    category: 'Entertainment',
    date: '2026-09-10',
    description: 'Monthly streaming subscription',
  },
  {
    id: 'sample-4',
    title: 'Electricity Bill',
    amount: 1850,
    type: 'expense',
    category: 'Bills',
    date: '2026-09-12',
    description: 'September electricity bill',
  },
  {
    id: 'sample-5',
    title: 'Freelance Project',
    amount: 15000,
    type: 'income',
    category: 'Other',
    date: '2026-09-15',
    description: 'Website redesign project payment',
  },
  {
    id: 'sample-6',
    title: 'Metro Card Recharge',
    amount: 500,
    type: 'expense',
    category: 'Transport',
    date: '2026-09-18',
    description: 'Monthly metro travel card',
  },
]

function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('expense-tracker-user')
      return saved ? JSON.parse(saved) : null
    } catch { return null }
  })

  const [token, setToken] = useState(() => {
    return localStorage.getItem('expense-tracker-token') || null
  })

  function handleAuthSuccess(userData, jwtToken) {
    setUser(userData)
    setToken(jwtToken)
    localStorage.setItem('expense-tracker-user', JSON.stringify(userData))
    localStorage.setItem('expense-tracker-token', jwtToken)
  }

  function handleLogout() {
    setUser(null)
    setToken(null)
    localStorage.removeItem('expense-tracker-user')
    localStorage.removeItem('expense-tracker-token')
  }

  if (!user || !token) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />
  }

  const [transactions, setTransactions] = useLocalStorage(
    'expense-tracker-transactions',
    SAMPLE_TRANSACTIONS
  )

  const [formData, setFormData] = useState(INITIAL_FORM_DATA)

  const [editingId, setEditingId] = useState(null)

  const [errors, setErrors] = useState({})

  const [searchText, setSearchText] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  const [deletingId, setDeletingId] = useState(null)

  const filteredTransactions = transactions
    .filter((t) => filterType === 'all' || t.type === filterType)
    .filter((t) => filterCategory === 'all' || t.category === filterCategory)
    .filter((t) => {
      if (!searchText.trim()) return true
      const query = searchText.toLowerCase()
      return (
        t.title.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query) ||
        (t.description && t.description.toLowerCase().includes(query))
      )
    })
    .slice()
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.date) - new Date(a.date)
      if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date)
      if (sortBy === 'highest') return b.amount - a.amount
      if (sortBy === 'lowest') return a.amount - b.amount
      return 0
    })

  function handleFormChange(field, value) {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value }
      if (field === 'type') {
        updated.category = ''
      }
      return updated
    })
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  function validate() {
    const newErrors = {}
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.trim().length < 2) {
      newErrors.title = 'Title must be at least 2 characters'
    }
    if (!formData.amount) {
      newErrors.amount = 'Amount is required'
    } else if (Number(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0'
    }
    if (!formData.category) {
      newErrors.category = 'Please select a category'
    }
    if (!formData.date) {
      newErrors.date = 'Date is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleAddTransaction() {
    if (!validate()) return

    const newTransaction = {
      id: generateId(),
      title: formData.title.trim(),
      amount: Number(formData.amount),
      type: formData.type,
      category: formData.category,
      date: formData.date,
      description: formData.description.trim(),
    }

    setTransactions([newTransaction, ...transactions])
    resetForm()
  }

  function handleDeleteRequest(id) {
    setDeletingId(id)
  }

  function handleConfirmDelete() {
    if (!deletingId) return

    setTransactions(transactions.filter((t) => t.id !== deletingId))

    if (editingId === deletingId) {
      resetForm()
    }
    setDeletingId(null)
  }

  function handleCancelDelete() {
    setDeletingId(null)
  }

  function handleEditStart(id) {
    const transactionToEdit = transactions.find((t) => t.id === id)
    if (!transactionToEdit) return

    setFormData({
      title: transactionToEdit.title,
      amount: String(transactionToEdit.amount),
      type: transactionToEdit.type,
      category: transactionToEdit.category,
      date: transactionToEdit.date,
      description: transactionToEdit.description || '',
    })
    setEditingId(id)
    setErrors({})

    document.getElementById('transaction-form-section')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  function handleSaveEdit() {
    if (!validate()) return

    setTransactions(
      transactions.map((t) => {
        if (t.id === editingId) {
          return {
            ...t,
            title: formData.title.trim(),
            amount: Number(formData.amount),
            type: formData.type,
            category: formData.category,
            date: formData.date,
            description: formData.description.trim(),
          }
        }

        return t
      })
    )
    resetForm()
  }

  function handleSubmit() {
    if (editingId) {
      handleSaveEdit()
    } else {
      handleAddTransaction()
    }
  }

  function resetForm() {
    setFormData(INITIAL_FORM_DATA)
    setEditingId(null)
    setErrors({})
  }

  function handleClearFilters() {
    setSearchText('')
    setFilterType('all')
    setFilterCategory('all')
    setSortBy('newest')
  }

  return (
    <div className="app">
      <Header
        transactionCount={transactions.length}
        user={user}
        onLogout={handleLogout}
      />

      <main className="main-content">

        <Summary transactions={transactions} />

        <div className="content-grid">
          <aside className="form-column" id="transaction-form-section">
            <TransactionForm
              formData={formData}
              onFormChange={handleFormChange}
              onSubmit={handleSubmit}
              onCancelEdit={resetForm}
              isEditing={editingId !== null}
              errors={errors}
            />
          </aside>

          <section className="list-column">
            <FilterBar
              searchText={searchText}
              filterType={filterType}
              filterCategory={filterCategory}
              sortBy={sortBy}
              onSearchChange={setSearchText}
              onTypeChange={setFilterType}
              onCategoryChange={setFilterCategory}
              onSortChange={setSortBy}
              onClearFilters={handleClearFilters}
            />

            <TransactionList
              transactions={transactions}
              filteredTransactions={filteredTransactions}
              onDelete={handleDeleteRequest}
              onEdit={handleEditStart}
              onClearFilters={handleClearFilters}
            />
          </section>
        </div>
      </main>

      {deletingId && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal">
            <div className="modal__icon">🗑️</div>
            <h3 className="modal__title">Delete Transaction?</h3>
            <p className="modal__message">
              This action cannot be undone. The transaction will be permanently removed.
            </p>
            <div className="modal__actions">
              <button
                className="btn btn--secondary"
                onClick={handleCancelDelete}
                id="cancel-delete-btn"
              >
                Cancel
              </button>
              <button
                className="btn btn--danger"
                onClick={handleConfirmDelete}
                id="confirm-delete-btn"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
