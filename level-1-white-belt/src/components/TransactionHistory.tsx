import type { TxHistoryItem } from '../utils/stellar'

interface TransactionHistoryProps {
  history: TxHistoryItem[]
  publicKey: string
  loading: boolean
}

export default function TransactionHistory({ history, publicKey, loading }: TransactionHistoryProps) {
  if (history.length === 0 && !loading) return null

  return (
    <div className="card">
      <h2>Transaction History</h2>
      {loading && history.length === 0 ? (
        <div className="loading-placeholder">
          <span className="spinner" />         </div>
      ) : null}
      {history.map((tx) => {
        const isSent = tx.sourceAccount === publicKey
        const label =
          tx.type === 'create_account'
            ? isSent
              ? 'Created Account'
              : 'Account Created'
            : tx.type === 'payment'
              ? isSent
                ? 'Sent'
                : 'Received'
              : tx.type
        const counterparty = isSent ? tx.to : tx.sourceAccount
        const date = new Date(tx.createdAt)

        return (
          <div key={tx.id} className="history-row">
            <div className="history-left">
              <span
                className={`history-badge ${isSent ? 'history-sent' : 'history-received'}`}
              >
                {label}
              </span>
              <span className="history-date">
                {date.toLocaleDateString()}{' '}
                {date.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <div className="history-right">
              {tx.amount && (
                <span
                  className={`history-amount ${isSent ? 'history-sent-amount' : 'history-received-amount'}`}
                >
                  {isSent ? '-' : '+'}
                  {parseFloat(tx.amount).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 7,
                  })}{' '}
                  {tx.asset}
                </span>
              )}
            </div>
            {counterparty && (
              <div className="history-address">
                {isSent ? 'To' : 'From'}:{' '}
                {counterparty.slice(0, 6)}...{counterparty.slice(-6)}
              </div>
            )}
            <div className="tx-hash">
              <a
                href={`https://stellar.expert/explorer/testnet/tx/${tx.hash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on Explorer
              </a>
            </div>
          </div>
        )
      })}
    </div>
  )
}
