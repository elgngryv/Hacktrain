import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
const source = await readFile(new URL('../../src/lib/api/client.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } });
const { ApiClient, ApiError, validatePassword, errorMessage } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
const credentials = (n = 1) => ({ accessToken: `access-${n}`, refreshToken: `refresh-${n}`, tokenType: 'Bearer', expiresIn: 600 });
const json = (body, status = 200, headers = {}) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...headers } });
const deferred = () => { let resolve; const promise = new Promise(r => { resolve = r; }); return { promise, resolve }; };
test('credentials only sent to authenticated endpoints; no cookies or GET body', async () => {
  const calls = []; const client = new ApiClient('/api/v1', async (url, init) => { calls.push({ url, init }); return json({ ok: true }); });
  await client.publicRequest('/auth/register', { email: 'learner@example.test' });
  client.establish(credentials()); await client.request('/auth/me');
  assert.equal(calls[0].init.headers.Authorization, undefined);
  assert.equal(calls[1].init.headers.Authorization, 'Bearer access-1');
  assert.equal(calls[1].init.credentials, 'omit'); assert.equal(calls[1].init.body, undefined);
});
test('twenty concurrent unauthorized requests rotate once and all use the new token', async () => {
  let rotations = 0; const gate = deferred();
  const client = new ApiClient('/api/v1', async (url, init) => {
    if (url.endsWith('/auth/refresh')) { rotations++; await gate.promise; return json(credentials(2)); }
    return init.headers.Authorization === 'Bearer access-1' ? json({ detail: 'expired' }, 401) : json({ tenant: 'own' });
  }); client.establish(credentials());
  const requests = Array.from({ length: 20 }, () => client.request('/organizations'));
  await new Promise(resolve => setImmediate(resolve)); gate.resolve();
  assert.equal((await Promise.all(requests)).length, 20); assert.equal(rotations, 1);
});
test('refresh replay/failure clears the session without retrying rotation', async () => {
  let calls = 0, ended = 0;
  const client = new ApiClient('/api/v1', async () => { calls++; return json({ detail: 'invalid' }, 401); });
  client.onSessionEnd = () => ended++; client.establish(credentials());
  await assert.rejects(client.request('/auth/me'), error => error.status === 401);
  assert.equal(calls, 2); assert.equal(ended, 1);
  await assert.rejects(client.request('/auth/me')); assert.equal(calls, 2);
});
test('an ambiguous refresh network failure is not replayed', async () => {
  let rotations = 0;
  const client = new ApiClient('/api/v1', async url => { if (url.endsWith('/refresh')) { rotations++; throw new TypeError('offline'); } return json({}, 401); });
  client.establish(credentials()); await assert.rejects(client.request('/auth/me'), error => error.status === 0);
  await assert.rejects(client.request('/auth/me'), error => error.status === 401); assert.equal(rotations, 1);
});
test('a response from a previous login cannot become data for a new session', async () => {
  const gate = deferred(); const client = new ApiClient('/api/v1', async () => { await gate.promise; return json({ private: 'old tenant' }); });
  client.establish(credentials()); const result = client.request('/organizations'); client.establish(credentials(2)); gate.resolve();
  await assert.rejects(result, error => error.status === 401);
});
test('logout waits for rotation then revokes the rotated refresh token', async () => {
  const gate = deferred(); let revoked;
  const client = new ApiClient('/api/v1', async (url, init) => {
    if (url.endsWith('/refresh')) { await gate.promise; return json(credentials(2)); }
    if (url.endsWith('/logout')) { revoked = JSON.parse(init.body).token; return new Response(null, { status: 204 }); }
    return init.headers.Authorization === 'Bearer access-1' ? json({}, 401) : json({ ok: true });
  }); client.establish(credentials());
  const result = client.request('/auth/me').catch(() => {}); await new Promise(resolve => setImmediate(resolve));
  const logout = client.logout(); gate.resolve(); await Promise.all([result, logout]); assert.equal(revoked, 'refresh-2');
  await assert.rejects(client.request('/auth/me'));
});
test('mutations are not repeated on 403, 409, 429, 500 or network failure', async () => {
  for (const status of [403, 409, 429, 500, 0]) {
    let count = 0; const client = new ApiClient('/api/v1', async () => { count++; if (!status) throw new Error('offline'); return json({ detail: 'denied' }, status); });
    client.establish(credentials()); await assert.rejects(client.request('/organizations', 'POST', { name: 'Academy' })); assert.equal(count, 1);
  }
});
test('retry-after and RFC7807 details are preserved', async () => {
  const client = new ApiClient('/api/v1', async () => json({ detail: 'Limit keçilib.' }, 429, { 'Retry-After': '60' }));
  await assert.rejects(client.publicRequest('/auth/login', {}), error => error instanceof ApiError && errorMessage(error).includes('60 saniyə'));
});
test('AbortError passes through without refreshing or converting into offline errors', async () => {
  const client = new ApiClient('/api/v1', async () => { throw new DOMException('Aborted', 'AbortError'); }); client.establish(credentials());
  await assert.rejects(client.request('/organizations'), error => error.name === 'AbortError');
});
test('password validation enforces UTF-8 byte limit as well as minimum length', () => {
  assert.equal(validatePassword('12345678901'), false); assert.equal(validatePassword('a'.repeat(72)), true);
  assert.equal(validatePassword('a'.repeat(73)), false); assert.equal(validatePassword('ə'.repeat(36)), true); assert.equal(validatePassword('ə'.repeat(37)), false);
});
