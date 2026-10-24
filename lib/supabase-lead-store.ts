// A bounded adapter for the existing lead service. Only these audited operations
// can reach the database; arbitrary SQL is never accepted by the remote RPC.
const operations: Record<string, string> = {
  'DELETE FROM consultation_leads WHERE created_at < ?': 'purge',
  'SELECT * FROM consultation_leads WHERE request_hash = ? LIMIT 1': 'duplicate',
  'SELECT COUNT(*) AS count FROM consultation_leads WHERE submitter_hash = ? AND created_at > ?': 'count',
  'INSERT INTO consultation_leads (id, created_at, source, payload, request_hash, submitter_hash, report_token_hash, notification_status, notification_attempts, next_attempt_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?) ON CONFLICT(request_hash) DO NOTHING': 'insert',
  'SELECT * FROM consultation_leads WHERE id = ?': 'get',
  "UPDATE consultation_leads SET notification_status = 'pending', notification_error = 'invalid_webhook_configuration' WHERE id = ?": 'invalid_webhook',
  "UPDATE consultation_leads SET notification_status = 'sending', next_attempt_at = ?, notification_attempts = notification_attempts + 1 WHERE id = ? AND notification_status != 'sent' AND (notification_status != 'sending' OR next_attempt_at < ?)": 'claim',
  "UPDATE consultation_leads SET notification_status = 'sent', notified_at = ?, next_attempt_at = NULL, notification_error = NULL WHERE id = ?": 'sent',
  "UPDATE consultation_leads SET notification_status = 'pending', notification_error = ?, next_attempt_at = ? WHERE id = ?": 'failed',
  'SELECT * FROM consultation_leads ORDER BY created_at DESC LIMIT 100': 'list',
  'DELETE FROM consultation_leads WHERE id = ?': 'delete',
  "SELECT id FROM consultation_leads WHERE notification_status != 'sent' ORDER BY created_at ASC LIMIT 10": 'retry',
  'SELECT * FROM consultation_leads WHERE id = ? AND created_at >= ?': 'report',
};

export function createSupabaseLeadDatabase(url: string, key: string) {
  const endpoint = new URL('/rest/v1/rpc/deep_embrace_store', url);
  if (endpoint.protocol !== 'https:') throw new Error('Supabase requires HTTPS');
  return {
    prepare(sql: string) {
      const operation = operations[sql];
      if (!operation) throw new Error('Unsupported lead storage operation');
      let values: unknown[] = [];
      async function execute(): Promise<{ rows: unknown[]; changes: number }> {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ operation, args: values }),
          signal: AbortSignal.timeout(10000), redirect: 'error',
        });
        if (!response.ok) throw new Error('Lead database unavailable');
        return response.json();
      }
      const statement = {
        bind(...args: unknown[]) { values = args; return statement; },
        async first<T>(): Promise<T | null> { return ((await execute()).rows[0] as T) ?? null; },
        async all<T>(): Promise<{ results: T[] }> { return { results: (await execute()).rows as T[] }; },
        async run() { return { meta: { changes: (await execute()).changes } }; },
      };
      return statement;
    },
  };
}
