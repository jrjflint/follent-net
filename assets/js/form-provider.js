// Provider-specific transport is isolated from form fields and visual markup.
// Native HTML remains the fallback when JavaScript does not run.
export async function submitFormspark(endpoint, data, fetcher = fetch) {
  const response = await fetcher(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(data),
    signal: AbortSignal.timeout(20000),
    credentials: 'omit',
    referrerPolicy: 'no-referrer'
  });
  if (!response.ok) throw new Error(`The form service returned ${response.status}`);
  return true;
}
