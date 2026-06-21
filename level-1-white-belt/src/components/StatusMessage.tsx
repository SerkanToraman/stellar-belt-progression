import type { TxResult } from '../utils/stellar'
import StellarLogo from './StellarLogo'

interface StatusMessageProps {
  error: string
  errorType: 'connection' | 'transaction' | 'fund'
  txResult: TxResult | null
  onClose: () => void
}

const ERROR_TITLES: Record<string, string> = {
  connection: 'Connection Failed',
  transaction: 'Transaction Failed',
  fund: 'Funding Failed',
}

export default function StatusMessage({ error, errorType, txResult, onClose }: StatusMessageProps) {
  const showPopup = error || txResult?.success
  if (!showPopup) return null

  return (
    <>
      <div className="popup-backdrop" onClick={onClose} />

      <div className="popup">
        <div className="popup-content">
          <button className="popup-close" onClick={onClose}>&times;</button>

          {/* Success */}
          {txResult?.success && (
            <>
              <div className="popup-icon popup-icon-success">
                <StellarLogo size={48} />
              </div>

              <h3 className="popup-title">Transaction Successful!</h3>

              {txResult.hash === 'Funded via Friendbot' ? (
                <>
                  <div className="popup-token">
                    <span className="popup-token-amount">+10,000</span>
                    <span className="popup-token-symbol">XLM</span>
                  </div>
                  <p className="popup-subtitle">Funded via Stellar Friendbot</p>
                </>
              ) : (
                <>
                  <div className="popup-token">
                    <span className="popup-token-amount">
                      -{parseFloat(txResult.amount || '0').toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 7,
                      })}
                    </span>
                    <span className="popup-token-symbol">XLM</span>
                  </div>
                  {txResult.hash && (
                    <div className="popup-hash">
                      <a
                        href={`https://stellar.expert/explorer/testnet/tx/${txResult.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View on Stellar Explorer
                      </a>
                    </div>
                  )}
                </>
              )}

              <button className="btn btn-success popup-btn" onClick={onClose}>
                Done
              </button>
            </>
          )}

          {/* Error */}
          {error && !txResult?.success && (
            <>
              <div className="popup-icon popup-icon-error">
                <span className="popup-error-x">!</span>
              </div>

              <h3 className="popup-title popup-title-error">
                {ERROR_TITLES[errorType]}
              </h3>
              <p className="popup-subtitle">{error}</p>

              <button className="btn btn-primary popup-btn" onClick={onClose}>
                Try Again
              </button>
            </>
          )}
        </div>
      </div>
    </>
  )
}
