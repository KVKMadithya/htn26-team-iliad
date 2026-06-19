import { asText, runStatement, serviceFailure } from '@/lib/platform-db'

export async function GET() {
  try {
    // SECURITY FIX: Removed 'password' from the SELECT statement.
    // We never want to send passwords to the client in a GET request!
    const result = await runStatement(
      'SELECT id, username, role, full_name, nic, email FROM users ORDER BY id'
    )

    return Response.json({
      ok: true,
      note: 'Login reference data.',
      users: result.rows || []
    })
  } catch (reason) {
    return serviceFailure(reason)
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))

    // Explicitly grab the 'account' field from your frontend's LoginPage state
    const rawUsername = asText(body.account)
    const rawPassword = asText(body.password)

    console.log('Login attempt for:', rawUsername) // Check your terminal!

    if (!rawUsername || !rawPassword) {
      return Response.json(
        { ok: false, error: 'Missing credentials.' },
        { status: 400 }
      )
    }

    // SECURITY FIX: Basic SQL Injection Prevention
    // Escaping single quotes prevents malicious users from breaking the SQL syntax.
    const username = rawUsername.replace(/'/g, "''")
    const password = rawPassword.replace(/'/g, "''")

    const sql = `
  SELECT id, username, role, full_name, email
  FROM users
  WHERE LOWER(username) = LOWER('${username}') AND password = '${password}'
  LIMIT 1
`
    const result = await runStatement(sql)

    if (!result.rows || result.rows.length === 0) {
      return Response.json(
        {
          ok: false,
          error: 'Invalid username or password.'
          // SECURITY FIX: Removed the SQL string leak
        },
        { status: 401 }
      )
    }

    const user = result.rows[0]
    const headers = new Headers()

    // Sets the browser cookies so the user actually stays logged in
    headers.append('set-cookie', `user_id=${user.id}; Path=/; SameSite=Lax`)
    headers.append('set-cookie', `role=${user.role}; Path=/; SameSite=Lax`)

    return Response.json(
      {
        ok: true,
        token: Buffer.from(`${user.id}:${user.role}:session-token`).toString(
          'base64'
        ),
        user
        // SECURITY FIX: Removed the SQL string leak
      },
      { headers }
    )
  } catch (reason: any) {
    return Response.json(
      { ok: false, error: reason.message || 'Server error' },
      { status: 500 }
    )
  }
}
