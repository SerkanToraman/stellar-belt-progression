import type { BalanceInfo } from '../utils/stellar'

interface BalanceProps {
  balances: BalanceInfo[]
  loading: string
  loadingBalances: boolean
  onRefresh: () => void
  onFund: () => void
}

export default function Balance({ balances, loading, loadingBalances, onRefresh, onFund }: BalanceProps) {
  const xlmBalance = balances.find((b) => b.asset === 'XLM')

  return (
    <div className="card">
      <div className="header">
        <h2>Balance</h2>
        <button
          className="btn btn-sm btn-primary"
          onClick={onRefresh}
          disabled={loading === 'refresh' || loadingBalances}
        >
          {loading === 'refresh' || loadingBalances ? <span className="spinner" /> : 'Refresh'}
        </button>
      </div>

      {loadingBalances && balances.length === 0 ? (
        <div className="loading-placeholder">
          <span className="spinner" />         </div>
      ) : balances.length > 0 ? (
        balances.map((b) => (
          <div key={b.asset} className="balance-row">
            <span className="balance-asset">{b.asset}</span>
            <span className="balance-amount">
              {parseFloat(b.balance).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 7,
              })}
            </span>
          </div>
        ))
      ) : (
        <p style={{ color: 'var(--text-muted)' }}>
          No balance found. Fund your account using the button below.
        </p>
      )}

      {(!xlmBalance || parseFloat(xlmBalance.balance) === 0) && (
        <button
          className="btn btn-warning"
          onClick={onFund}
          disabled={loading === 'fund'}
          style={{ marginTop: '16px', width: '100%' }}
        >
          {loading === 'fund' ? (
            <>
              <span className="spinner" /> Funding...
            </>
          ) : (
            'Fund with Testnet Friendbot (10,000 XLM)'
          )}
        </button>
      )}

      {xlmBalance && parseFloat(xlmBalance.balance) > 0 && (
        <button
          className="btn btn-warning btn-sm"
          onClick={onFund}
          disabled={loading === 'fund'}
          style={{ marginTop: '12px' }}
        >
          {loading === 'fund' ? (
            <>
              <span className="spinner" /> Funding...
            </>
          ) : (
            'Fund Again (Friendbot)'
          )}
        </button>
      )}
    </div>
  )
}
