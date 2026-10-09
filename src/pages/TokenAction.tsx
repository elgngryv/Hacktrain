import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api/client';
import { type Member } from '@/lib/api/organization';
import { Page, Panel, Failure, Notice, fieldClass } from '@/components/platform/Platform';
import { Button } from '@/components/ui/button';
export default function TokenAction() {
  const [token, setToken] = useState(() => new URLSearchParams(window.location.hash.slice(1)).get('token') ?? '');
  const [busy, setBusy] = useState(false); const [error, setError] = useState<unknown>();
  const { user, signIn } = useAuth(); const navigate = useNavigate();
  useEffect(() => { window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search); }, []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy) return; setError(undefined); const data = new FormData(event.currentTarget); setBusy(true);
    try {
      if (!user) await signIn(String(data.get('email')).trim(), String(data.get('password')));
      const member = await api.request<Member>('/invitations/accept', 'POST', { token });
      setToken(''); navigate(`/organizations/${member.organizationId}`, { replace: true });
    } catch (error) { setError(error); } finally { setBusy(false); }
  }
  return <Page title="Təşkilata dəvət" description="Paylaşılan dəvət linkini qəbul edin."><div className="max-w-xl"><Panel title="Dəvəti qəbul et">
    {error && <Failure error={error} />}
    {!/^[A-Za-z0-9_-]{43}$/.test(token) ? <><Failure error={new Error('Link natamamdır. Təşkilat administratorundan yeni link alın.')} /><Link to="/auth">Giriş →</Link></> : <form onSubmit={submit} className="space-y-4">
      {!user && <><Notice>Dəvətin aid olduğu hesabla daxil olun.</Notice><label className="block space-y-2 text-sm"><span>E-poçt</span><input name="email" type="email" defaultValue="elgun@gmail.com" autoComplete="email" required className={fieldClass} /></label><label className="block space-y-2 text-sm"><span>Şifrə</span><input name="password" type="password" autoComplete="current-password" required className={fieldClass} /></label></>}
      {user && <p className="break-all">Dəvət {user.email} hesabı ilə qəbul ediləcək.</p>}
      <Button type="submit" disabled={busy}>{busy ? 'Yoxlanılır…' : 'Dəvəti qəbul et'}</Button>
    </form>}
  </Panel></div></Page>;
}
