import { useState, useCallback } from 'react'
import { checkFreighterInstalled, connectWallet, signTx } from '../utils/wallet'
import {
  getBalances,
  fundWithFriendbot,
  buildSendXlmTx,
  submitTransaction,
  getTransactionHistory,
  type BalanceInfo,
  type TxResult,
  type TxHistoryItem,
} from '../utils/stellar'
import type { SendFormData } from '../components/SendXlm'

export function useWallet() {
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const [balances, setBalances] = useState<BalanceInfo[]>([])
  const [loading, setLoading] = useState('')
  const [loadingBalances, setLoadingBalances] = useState(false)
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [error, setError] = useState('')
  const [txResult, setTxResult] = useState<TxResult | null>(null)
  const [history, setHistory] = useState<TxHistoryItem[]>([])

  const clearStatus = () => {
    setError('')
    setTxResult(null)
  }

  const fetchHistory = useCallback(async (key: string) => {
    setLoadingHistory(true)
    try {
      const h = await getTransactionHistory(key)
      setHistory(h)
    } catch {
      setHistory([])
    } finally {
      setLoadingHistory(false)
    }
  }, [])

  const fetchBalances = useCallback(async (key: string) => {
    setLoadingBalances(true)
    try {
      const b = await getBalances(key)
      setBalances(b)
    } catch {
      setBalances([])
    } finally {
      setLoadingBalances(false)
    }
  }, [])

  const handleConnect = async () => {
    clearStatus()
    setLoading('connect')
    try {
      const installed = await checkFreighterInstalled()
      if (!installed) {
        setError(
          'Freighter wallet not found. Please install Freighter browser extension from freighter.app'
        )
        return
      }
      const key = await connectWallet()
      setPublicKey(key)
      await fetchBalances(key)
      await fetchHistory(key)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet')
    } finally {
      setLoading('')
    }
  }

  const handleDisconnect = () => {
    setPublicKey(null)
    setBalances([])
    setHistory([])
    clearStatus()
  }

  const handleFund = async () => {
    if (!publicKey) return
    clearStatus()
    setLoading('fund')
    try {
      const ok = await fundWithFriendbot(publicKey)
      if (ok) {
        await fetchBalances(publicKey)
        await fetchHistory(publicKey)
        setTxResult({ success: true, hash: 'Funded via Friendbot' })
      } else {
        setError('Friendbot funding failed. Account may already be funded.')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fund account')
    } finally {
      setLoading('')
    }
  }

  const handleSend = async (data: SendFormData) => {
    if (!publicKey) return
    clearStatus()

    setLoading('send')
    try {
      const xdr = await buildSendXlmTx(publicKey, data.destination, data.amount, data.memo)
      const signedXdr = await signTx(xdr)
      const result = await submitTransaction(signedXdr)

      if (result.success) {
        setTxResult({ ...result, amount: data.amount })
        await fetchBalances(publicKey)
        await fetchHistory(publicKey)
      } else {
        setError(result.error || 'Transaction failed')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Transaction failed')
    } finally {
      setLoading('')
    }
  }

  const handleRefresh = async () => {
    if (!publicKey) return
    setLoading('refresh')
    try {
      await fetchBalances(publicKey)
      await fetchHistory(publicKey)
    } finally {
      setLoading('')
    }
  }

  return {
    publicKey,
    balances,
    loading,
    loadingBalances,
    loadingHistory,
    error,
    txResult,
    history,
    handleConnect,
    handleDisconnect,
    handleFund,
    handleSend,
    handleRefresh,
    clearStatus,
  }
}
