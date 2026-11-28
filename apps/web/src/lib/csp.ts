/**
 * Content Security Policy (SR-2). Each response gets a fresh nonce: Next.js reads it from the
 * request's CSP header and adds it to its own inline bootstrap scripts, so scripts need no
 * 'unsafe-inline'. 'strict-dynamic' lets those trusted scripts load the app's chunks. Pages are
 * rendered per request (the locale layout is force-dynamic), which nonces require.
 *
 * Styles keep 'unsafe-inline' because React style attributes cannot carry a nonce; style
 * injection cannot run script, and everything else stays same-origin.
 */
export function createNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes));
}

export function buildCsp(nonce: string, isDev: boolean): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ''}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    `connect-src 'self'${isDev ? ' ws:' : ''}`,
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ].join('; ');
}
