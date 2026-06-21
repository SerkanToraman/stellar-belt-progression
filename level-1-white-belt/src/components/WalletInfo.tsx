import { shortenKey } from '../utils/helpers'
import StellarLogo from './StellarLogo'

interface WalletInfoProps {
  publicKey: string
  onDisconnect: () => void
}

export default function WalletInfo({ publicKey, onDisconnect }: WalletInfoProps) {
  return (
    <>
      <div className="header">
        <div>
          <div className="flex-row" style={{ gap: '10px' }}>
            <StellarLogo size={36} />
            <h1>Stellar Wallet</h1>
          </div>
          <span className="badge badge-testnet">Testnet</span>
        </div>
        <button className="disconnect-btn" onClick={onDisconnect}>
          Disconnect
        </button>
      </div>

      <div className="card">
        <div className="flex-row">
          <span className="connected-dot" />
          <span style={{ fontWeight: 600, color: '#fff' }}>
            Connected: {shortenKey(publicKey)}
          </span>
        </div>
      </div>
    </>
  )
}
