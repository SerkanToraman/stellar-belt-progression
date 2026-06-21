import { useWallet } from './hooks/useWallet'
import ConnectWallet from './components/ConnectWallet'
import WalletInfo from './components/WalletInfo'
import Balance from './components/Balance'
import SendXlm from './components/SendXlm'
import TransactionHistory from './components/TransactionHistory'
import StatusMessage from './components/StatusMessage'

function App() {
  const {
    publicKey,
    balances,
    loading,
    loadingBalances,
    loadingHistory,
    error,
    errorType,
    txResult,
    history,
    handleConnect,
    handleDisconnect,
    handleFund,
    handleSend,
    handleRefresh,
    clearStatus,
  } = useWallet()

  if (!publicKey) {
    return (
      <>
        <ConnectWallet
          loading={loading}
          onConnect={handleConnect}
        />
        <StatusMessage error={error} errorType={errorType} txResult={txResult} onClose={clearStatus} />
      </>
    )
  }

  return (
    <div>
      <WalletInfo publicKey={publicKey} onDisconnect={handleDisconnect} />
      <Balance
        balances={balances}
        loading={loading}
        loadingBalances={loadingBalances}
        onRefresh={handleRefresh}
        onFund={handleFund}
      />
      <SendXlm loading={loading} onSend={handleSend} />
      <TransactionHistory history={history} publicKey={publicKey} loading={loadingHistory} />
      <StatusMessage error={error} errorType={errorType} txResult={txResult} onClose={clearStatus} />

      <div
        style={{
          textAlign: 'center',
          marginTop: '32px',
          color: 'var(--text-muted)',
          fontSize: '0.8rem',
        }}
      >
        Stellar White Belt dApp &bull; Built on Stellar Testnet
      </div>
    </div>
  )
}

export default App
