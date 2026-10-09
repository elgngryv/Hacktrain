import { apiBaseUrl } from './base-url';
export interface Tokens { accessToken: string; refreshToken: string; tokenType: string; expiresIn: number }
export interface Profile { id: string; email: string; emailVerified: boolean; platformRole: string; createdAt: string }
export class ApiError extends Error {
  status: number;
  retryAfter: string | null;
  constructor(status: number, message: string, retryAfter: string | null = null) {
    super(message); this.name = 'ApiError'; this.status = status; this.retryAfter = retryAfter;
  }
}
/** Credentials deliberately live only in memory. A reload requires a new login. */
export class ApiClient {
  private tokens: Tokens | null = null;
  private revision = 0;
  private refreshing: Promise<void> | null = null;
  onSessionEnd: () => void = () => {};
  constructor(private base = '/api/v1', private transport: typeof fetch = (input, init) => fetch(input, init)) {}
  establish(tokens: Tokens) { this.revision++; this.tokens = tokens; }
  clear() { this.revision++; this.tokens = null; this.onSessionEnd(); }
  private async send<T>(path: string, method: string, body: unknown, token?: string, signal?: AbortSignal): Promise<T> {
    let response: Response;
    try {
      response = await this.transport(this.base + path, {
        method, credentials: 'omit', cache: 'no-store', signal,
        headers: { Accept: 'application/json', ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') throw error;
      throw new ApiError(0, 'Serverə qoşulmaq mümkün olmadı. Bağlantını yoxlayın.');
    }
    if (!response.ok) {
      const problem = await response.json().catch(() => ({}));
      throw new ApiError(response.status, typeof problem.detail === 'string' ? problem.detail : `Sorğu uğursuz oldu (${response.status}).`, response.headers.get('Retry-After'));
    }
    return response.status === 204 ? undefined as T : response.json();
  }
  publicRequest<T>(path: string, body?: unknown) { return this.send<T>(path, 'POST', body); }
  async request<T>(path: string, method = 'GET', body?: unknown, signal?: AbortSignal): Promise<T> {
    const revision = this.revision;
    const used = this.tokens;
    if (!used) throw new ApiError(401, 'Davam etmək üçün hesabınıza daxil olun.');
    try {
      const result = await this.send<T>(path, method, body, used.accessToken, signal);
      if (revision !== this.revision) throw new ApiError(401, 'Sessiya dəyişib.');
      return result;
    } catch (error) {
      if (!(error instanceof ApiError) || error.status !== 401 || revision !== this.revision) throw error;
      // All concurrent 401s share one rotation. A late 401 uses the already rotated token.
      if (this.tokens === used && !this.refreshing) {
        this.refreshing = this.send<Tokens>('/auth/refresh', 'POST', { token: used.refreshToken })
          .then(tokens => { if (revision === this.revision) this.tokens = tokens; })
          .catch(error => { if (revision === this.revision) this.clear(); throw error; })
          .finally(() => { this.refreshing = null; });
      }
      if (this.refreshing) await this.refreshing;
      if (revision !== this.revision || !this.tokens) throw new ApiError(401, 'Sessiya bitib. Yenidən daxil olun.');
      try {
        const result = await this.send<T>(path, method, body, this.tokens.accessToken, signal);
        if (revision !== this.revision) throw new ApiError(401, 'Sessiya dəyişib.');
        return result;
      } catch (retryError) {
        if (retryError instanceof ApiError && retryError.status === 401 && revision === this.revision) this.clear();
        throw retryError;
      }
    }
  }
  async logout() {
    // Wait for rotation so the latest refresh token is revoked.
    try { await this.refreshing; } catch { /* Session was already cleared. */ }
    const token = this.tokens?.refreshToken;
    this.clear();
    if (token) await this.send('/auth/logout', 'POST', { token });
  }
}
export const api = new ApiClient(apiBaseUrl(import.meta.env?.VITE_API_BASE_URL));
export function errorMessage(error: unknown) {
  if (error instanceof ApiError && error.status === 429) return `${error.message} ${error.retryAfter ? `${error.retryAfter} saniyə sonra yenidən cəhd edin.` : 'Bir qədər sonra yenidən cəhd edin.'}`;
  return error instanceof Error ? error.message : 'Gözlənilməz xəta baş verdi.';
}
export function validatePassword(password: string) {
  return password.length >= 12 && new TextEncoder().encode(password).length <= 72;
}
