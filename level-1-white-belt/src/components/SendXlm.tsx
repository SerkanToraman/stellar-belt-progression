import { useForm } from 'react-hook-form'

interface SendFormData {
  destination: string
  amount: string
  memo: string
}

interface SendXlmProps {
  loading: string
  onSend: (data: SendFormData) => void
}

export default function SendXlm({ loading, onSend }: SendXlmProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<SendFormData>({
    mode: 'onChange',
    defaultValues: { destination: '', amount: '', memo: '' },
  })

  const onSubmit = (data: SendFormData) => {
    onSend(data)
    reset()
  }

  return (
    <div className="card">
      <h2>Send XLM</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>Destination Address</label>
          <input
            type="text"
            placeholder="G..."
            {...register('destination', {
              required: 'Destination address is required',
              pattern: {
                value: /^G[A-Z2-7]{55}$/,
                message: 'Invalid Stellar address',
              },
            })}
          />
          {errors.destination && (
            <span className="field-error">{errors.destination.message}</span>
          )}
        </div>
        <div className="form-group">
          <label>Amount (XLM)</label>
          <input
            type="number"
            placeholder="10"
            min="0"
            step="0.0000001"
            {...register('amount', {
              required: 'Amount is required',
              validate: (v) =>
                parseFloat(v) > 0 || 'Amount must be greater than 0',
            })}
          />
          {errors.amount && (
            <span className="field-error">{errors.amount.message}</span>
          )}
        </div>
        <div className="form-group">
          <label>Memo (optional)</label>
          <input
            type="text"
            placeholder="Payment memo"
            {...register('memo', {
              maxLength: {
                value: 28,
                message: 'Memo cannot exceed 28 characters',
              },
            })}
          />
          {errors.memo && (
            <span className="field-error">{errors.memo.message}</span>
          )}
        </div>
        <button
          type="submit"
          className="btn btn-success"
          disabled={loading === 'send' || !isValid}
          style={{ width: '100%' }}
        >
          {loading === 'send' ? (
            <>
              <span className="spinner" /> Sending...
            </>
          ) : (
            'Send XLM'
          )}
        </button>
      </form>
    </div>
  )
}

export type { SendFormData }
