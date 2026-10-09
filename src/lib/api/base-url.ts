/** Public deployment configuration only. Never put API keys in VITE_ variables. */
export function apiBaseUrl(value?: string): string {
  const base = (value || '/api/v1').trim().replace(/\/+$/, '');
  if (base === '/api/v1') return base;
  let url: URL;
  try { url = new URL(base); } catch { throw new Error('VITE_API_BASE_URL must be /api/v1 or an absolute API URL ending in /api/v1.'); }
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  if ((url.protocol !== 'https:' && !(local && url.protocol === 'http:')) || url.username || url.password || url.search || url.hash || url.pathname !== '/api/v1') {
    throw new Error('VITE_API_BASE_URL must use HTTPS and end in /api/v1 (HTTP is allowed for localhost).');
  }
  return base;
}
