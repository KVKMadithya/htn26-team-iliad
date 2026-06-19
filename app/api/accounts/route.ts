import { asText, runStatement, serviceFailure } from '@/lib/platform-db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    // SECURITY FIX: We strictly parse this as an integer.
    // If a hacker puts SQL commands in the URL, this turns it into 'NaN' and blocks it.
    const rawUserId = searchParams.get('userId') || '1'
    const userId = parseInt(rawUserId, 10)

    if (isNaN(userId)) {
      throw new Error('Invalid User ID format.')
    }

    const includePins = searchParams.get('includePins') === 'true'
    const columns = includePins
      ? 'a.*, u.username, u.full_name, u.email'
      : 'a.id, a.user_id, a.account_number, a.account_name, a.balance, u.username, u.full_name'

    const sql = `
      SELECT ${columns}
      FROM accounts a
      JOIN users u ON u.id = a.user_id
      WHERE a.user_id = ${userId}
      ORDER BY a.id
    `
    const result = await runStatement(sql)

    return Response.json({
      ok: true,
      note: 'Account list prepared.',
      accounts: result.rows || []
    })
  } catch (reason) {
    return serviceFailure(reason)
  }
}
