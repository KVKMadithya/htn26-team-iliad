import { asText, runStatement, serviceFailure } from '@/lib/platform-db'

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    // Note: In a real app, 'fromAccount' must come from a secure session/token, not the request body!
    const fromAccount = asText(body.fromAccount || body.from || '1000003423')
    const toAccount = asText(body.toAccount || body.to)
    const amount = Number(asText(body.amount || '0'))
    const description = asText(body.description)
    const userId = asText(body.userId || '1')

    if (amount <= 0 || isNaN(amount)) {
      throw new Error('Invalid transfer amount.')
    }

    // 1. Check if the sender has enough money
    const balanceCheck = await runStatement(`
      SELECT balance FROM accounts WHERE account_number = '${fromAccount}'
    `)

    if (!balanceCheck.rows || balanceCheck.rows.length === 0) {
      throw new Error('Sender account not found.')
    }

    if (Number(balanceCheck.rows[0].balance) < amount) {
      throw new Error('Insufficient Balance')
    }

    // 2. Lock the database and perform the transfer safely
    await runStatement('BEGIN')

    await runStatement(`
      UPDATE accounts
      SET balance = balance - ${amount}
      WHERE account_number = '${fromAccount}'
    `)

    await runStatement(`
      UPDATE accounts
      SET balance = balance + ${amount}
      WHERE account_number = '${toAccount}'
    `)

    const inserted = await runStatement(`
      INSERT INTO transactions (from_account, to_account, amount, description, created_by)
      VALUES ('${fromAccount}', '${toAccount}', ${amount}, '${description}', ${userId})
      RETURNING *
    `)

    await runStatement('COMMIT')

    return Response.json({
      ok: true,
      message: 'Transfer successful.',
      transaction: inserted.rows[0]
    })
  } catch (reason: any) {
    // If anything fails, revert all changes so money isn't lost
    await runStatement('ROLLBACK').catch(() => {})
    return Response.json(
      {
        ok: false,
        error: reason.message || 'Transfer failed'
      },
      { status: 400 }
    )
  }
}
