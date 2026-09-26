function Header({ transactionCount, user, onLogout }) {
  const initials = user?.name
    ? user.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
    : '👤'

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-brand">
          <div className="header-logo">💰</div>
          <div>
            <h1 className="header-title">Expense Tracker</h1>
            <p className="header-subtitle">Your personal finance manager</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className="header-stat">
            <span className="header-stat-number">{transactionCount}</span>
            <span className="header-stat-label">
              {transactionCount === 1 ? 'Transaction' : 'Transactions'}
            </span>
          </div>

          {user && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: 'rgba(30, 32, 53, 0.8)',
                border: '1px solid rgba(108, 99, 255, 0.25)',
                padding: '6px 14px 6px 8px',
                borderRadius: '50px',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6c63ff 0%, #9b59ff 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '13px',
                  color: 'white',
                  boxShadow: '0 2px 8px rgba(108, 99, 255, 0.4)',
                }}
              >
                {initials}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#e2e8f0', lineHeight: 1.2 }}>
                  {user.name}
                </span>
                <span style={{ fontSize: '11px', color: '#8892a4', lineHeight: 1.2 }}>
                  {user.email}
                </span>
              </div>

              <button
                onClick={onLogout}
                title="Log out of your account"
                style={{
                  marginLeft: '6px',
                  background: 'rgba(240, 86, 110, 0.12)',
                  border: '1px solid rgba(240, 86, 110, 0.3)',
                  color: '#f0566e',
                  borderRadius: '20px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(240, 86, 110, 0.25)'
                  e.currentTarget.style.borderColor = 'rgba(240, 86, 110, 0.6)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(240, 86, 110, 0.12)'
                  e.currentTarget.style.borderColor = 'rgba(240, 86, 110, 0.3)'
                }}
              >
                <span>🚪</span> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
