import * as StellarSdk from '@stellar/stellar-sdk'

const HORIZON_URL = 'https://horizon-testnet.stellar.org'
const FRIENDBOT_URL = 'https://friendbot.stellar.org'
const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET

const server = new StellarSdk.Horizon.Server(HORIZON_URL)

export interface BalanceInfo {
  asset: string
  balance: string
}

export interface TxResult {
  success: boolean
  hash?: string
  error?: string
  amount?: string
}

export async function getBalances(publicKey: string): Promise<BalanceInfo[]> {
  const account = await server.loadAccount(publicKey)
  return account.balances.map((b) => {
    const asset =
      b.asset_type === 'native'
        ? 'XLM'
        : `${(b as StellarSdk.Horizon.HorizonApi.BalanceLineAsset).asset_code}`
    return { asset, balance: b.balance }
  })
}

export async function fundWithFriendbot(publicKey: string): Promise<boolean> {
  const response = await fetch(`${FRIENDBOT_URL}?addr=${publicKey}`)
  return response.ok
}

async function accountExists(publicKey: string): Promise<boolean> {
  try {
    await server.loadAccount(publicKey)
    return true
  } catch {
    return false
  }
}

export async function buildSendXlmTx(
  sourcePublicKey: string,
  destination: string,
  amount: string,
  memo?: string
): Promise<string> {
  const account = await server.loadAccount(sourcePublicKey)
  const fee = await server.fetchBaseFee()
  const destExists = await accountExists(destination)

  const builder = new StellarSdk.TransactionBuilder(account, {
    fee: fee.toString(),
    networkPassphrase: NETWORK_PASSPHRASE,
  })

  if (destExists) {
    builder.addOperation(
      StellarSdk.Operation.payment({
        destination,
        asset: StellarSdk.Asset.native(),
        amount,
      })
    )
  } else {
    // Destination account doesn't exist yet — use createAccount
    builder.addOperation(
      StellarSdk.Operation.createAccount({
        destination,
        startingBalance: amount,
      })
    )
  }

  builder.setTimeout(30)

  if (memo) {
    builder.addMemo(StellarSdk.Memo.text(memo))
  }

  const tx = builder.build()
  return tx.toXDR()
}

export async function submitTransaction(signedXdr: string): Promise<TxResult> {
  try {
    const tx = StellarSdk.TransactionBuilder.fromXDR(
      signedXdr,
      NETWORK_PASSPHRASE
    )
    const result = await server.submitTransaction(tx)
    return { success: true, hash: result.hash }
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Transaction failed'
    return { success: false, error: message }
  }
}

export interface TxHistoryItem {
  id: string
  hash: string
  createdAt: string
  sourceAccount: string
  type: string
  to: string
  amount: string
  asset: string
  memo: string
  successful: boolean
}

export async function getTransactionHistory(
  publicKey: string
): Promise<TxHistoryItem[]> {
  const ops = await server
    .operations()
    .forAccount(publicKey)
    .order('desc')
    .limit(10)
    .call()

  const items: TxHistoryItem[] = []

  for (const op of ops.records) {
    const base = op as unknown as Record<string, unknown>
    const txHash = String(base.transaction_hash || '')

    let type = String(base.type || '')
    let to = ''
    let amount = ''
    let asset = 'XLM'

    if (type === 'payment') {
      to = String(base.to || '')
      amount = String(base.amount || '')
      asset =
        base.asset_type === 'native'
          ? 'XLM'
          : String(base.asset_code || '')
    } else if (type === 'create_account') {
      to = String(base.account || '')
      amount = String(base.starting_balance || '')
      asset = 'XLM'
      type = 'create_account'
    } else if (type === 'account_merge') {
      to = String(base.into || '')
    }

    items.push({
      id: String(base.id || ''),
      hash: txHash,
      createdAt: String(base.created_at || ''),
      sourceAccount: String(base.source_account || ''),
      type,
      to,
      amount,
      asset,
      memo: '',
      successful: base.transaction_successful === true,
    })
  }

  return items
}

export { NETWORK_PASSPHRASE }
