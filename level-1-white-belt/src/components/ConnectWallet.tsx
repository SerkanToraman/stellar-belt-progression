import StellarLogo from './StellarLogo'

interface ConnectWalletProps {
  loading: string
  onConnect: () => void
}

export default function ConnectWallet({ loading, onConnect }: ConnectWalletProps) {
  return (
    <div>
      <h1>Stellar Wallet</h1>
      <p className="subtitle">
        White Belt dApp &mdash; Connect, fund, and send XLM on Stellar Testnet
      </p>

      <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
        <div style={{ marginBottom: '16px', color: 'var(--accent)' }}>
          <StellarLogo size={64} />
        </div>
        <h2>Connect Your Wallet</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
          Connect your Freighter wallet to get started with Stellar testnet
        </p>
        <button
          className="btn btn-primary"
          onClick={onConnect}
          disabled={loading === 'connect'}
        >
          {loading === 'connect' ? (
            <>
              <span className="spinner" /> Connecting...
            </>
          ) : (
            'Connect Freighter'
          )}
        </button>
      </div>

      <div style={{ textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Don't have Freighter?{' '}
          <a
            href="https://www.freighter.app/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--accent)' }}
          >
            Download it here
          </a>
        </p>
      </div>
    </div>
  )
}
