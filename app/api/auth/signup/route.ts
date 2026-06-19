import { asText, runStatement } from '@/lib/platform-db'

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))

    // Extract and safely escape data
    const accountNumber = asText(body.accountNumber).replace(/'/g, "''")
    const accountName = asText(body.accountName).replace(/'/g, "''")
    const email = asText(body.email).replace(/'/g, "''")
    const password = asText(body.password).replace(/'/g, "''")

    if (!accountNumber || !accountName || !email || !password) {
      return Response.json(
        { ok: false, error: 'All fields are required.' },
        { status: 400 }
      )
    }

    // FIX: Generate a truly unique username by appending a random suffix
    const baseUsername = email.split('@')[0].toLowerCase()
    const uniqueSuffix = Math.floor(1000 + Math.random() * 9000)
    const username = `${baseUsername}${uniqueSuffix}`

    const dummyNic = Math.floor(100000000 + Math.random() * 900000000) + 'V'

    // 1. Insert user
    const userInsert = await runStatement(`
      INSERT INTO users (username, password, full_name, email, role, nic)
      VALUES ('${username}', '${password}', '${accountName}', '${email}', 'customer', '${dummyNic}')
      RETURNING id
    `)

    const newUserId = userInsert.rows[0].id

    // 2. Link bank account
    await runStatement(`
      INSERT INTO accounts (user_id, account_number, account_name, balance)
      VALUES (${newUserId}, '${accountNumber}', '${accountName}', 0)
    `)

    return Response.json({ ok: true, message: 'Account created successfully!' })
  } catch (reason: any) {
    // CRITICAL: Log the full error to your terminal so we can see the column name
    console.error('FULL SIGNUP ERROR:', reason)

    const errorMessage = reason.message?.toLowerCase() || ''

    if (errorMessage.includes('unique constraint')) {
      // Try to identify if it's email, account_number, or username
      let field = 'data'
      if (errorMessage.includes('email')) field = 'email'
      if (errorMessage.includes('account_number')) field = 'account number'

      return Response.json(
        {
          ok: false,
          error: `That ${field} is already registered.`
        },
        { status: 400 }
      )
    }

    return Response.json(
      {
        ok: false,
        error: 'Database error. Check terminal logs.'
      },
      { status: 500 }
    )
  }
}
