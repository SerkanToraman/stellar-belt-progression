import {
  isConnected,
  getAddress,
  signTransaction,
  requestAccess,
} from '@stellar/freighter-api'
import { NETWORK_PASSPHRASE } from './stellar'

export async function checkFreighterInstalled(): Promise<boolean> {
  const result = await isConnected()
  return result.isConnected
}

export async function connectWallet(): Promise<string> {
  await requestAccess()
  const result = await getAddress()
  if (result.error) {
    throw new Error(String(result.error))
  }
  return result.address
}

export async function signTx(xdr: string): Promise<string> {
  // Ensure site is allowed before signing
  await requestAccess()
  const result = await signTransaction(xdr, {
    networkPassphrase: NETWORK_PASSPHRASE,
  })
  if (result.error) {
    throw new Error(String(result.error))
  }
  return result.signedTxXdr
}
