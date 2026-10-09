import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { api, validatePassword } from '@/lib/api/client';
import { type Member } from '@/lib/api/organization';
import { Page, Panel, Failure, Notice, fieldClass } from '@/components/platform/Platform';
import { Button } from '@/components/ui/button';
type Action = 'verify-email' | 'reset-password' | 'accept-invitation';
export default function TokenAction({ action }: { action: Action }) {
  const [token, setToken] = useState(() => new URLSearchParams(window.location.hash.slice(1)).get('token') ?? '');
  const [busy, setBusy] = useState(false); const [done, setDone] = useState(false); const [error, setError] = useState<unknown>();
  const { user, signIn } = useAuth(); const navigate = useNavigate();
  useEffect(() => { window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search); }, []);
  const title = { 'verify-email': 'E-poçtun təsdiqi', 'reset-password': 'Şifrənin bərpası', 'accept-invitation': 'Təşkilata dəvət' }[action];
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy) return; setError(undefined); const data = new FormData(event.currentTarget);
    if (action === 'reset-password' && (!validatePassword(String(data.get('password'))) || data.get('password') !== data.get('confirm'))) { setError(new Error('Şifrə ən azı 12 simvol, ən çox 72 UTF-8 bayt olmalı və təkrarı ilə uyğun gəlməlidir.')); return; }
    setBusy(true);
    try {
      if (action === 'accept-invitation') {
        if (!user) await signIn(String(data.get('email')).trim(), String(data.get('password')));
        const member = await api.request<Member>('/invitations/accept', 'POST', { token }); setToken(''); navigate(`/organizations/${member.organizationId}`, { replace: true });
      } else { await api.publicRequest(`/auth/${action}`, { token, ...(action === 'reset-password' ? { password: data.get('password') } : {}) }); setDone(true); setToken(''); if (action === 'reset-password') api.clear(); }
    } catch (error) { setError(error); } finally { setBusy(false); }
  }
  return <Page title={title} description="E-poçtunuzdakı təhlükəsiz keçidin təsdiqi."><div className="max-w-xl"><Panel title={done ? 'Tamamlandı' : title}>{error && <Failure error={error} />}{done ? <><Notice>{action === 'verify-email' ? 'E-poçt ünvanınız təsdiqləndi.' : 'Şifrəniz yeniləndi.'}</Notice><Button asChild><Link to="/auth">Hesaba daxil ol</Link></Button></> : !/^[A-Za-z0-9_-]{43}$/.test(token) ? <><Failure error={new Error('Keçid natamamdır. E-poçtdakı keçidi yenidən açın və ya yeni məktub istəyin.')} /><Link className="text-primary" to="/auth">Giriş və bərpa səhifəsi →</Link></> : <form onSubmit={submit} className="space-y-4">
    {action === 'accept-invitation' && !user && <><Notice>Dəvət göndərilən e-poçtla daxil olun. Hesabınız yoxdursa, ayrıca səhifədə qeydiyyatdan keçin, sonra bu keçidi yenidən açın.</Notice><label className="block space-y-2 text-sm"><span>E-poçt</span><input name="email" type="email" autoComplete="email" required className={fieldClass} /></label><label className="block space-y-2 text-sm"><span>Şifrə</span><input name="password" type="password" autoComplete="current-password" required className={fieldClass} /></label><Link to="/auth" target="_blank" rel="noopener noreferrer" className="text-primary text-sm">Qeydiyyatı ayrıca səhifədə aç</Link></>}
    {action === 'accept-invitation' && user && <p className="break-all">Dəvət {user.email} hesabı ilə qəbul ediləcək.</p>}
    {action === 'reset-password' && <>{['password', 'confirm'].map(name => <label key={name} className="block text-sm space-y-2"><span>{name === 'password' ? 'Yeni şifrə' : 'Şifrənin təkrarı'}</span><input name={name} type="password" required minLength={12} autoComplete="new-password" className={fieldClass} /></label>)}</>}
    <Button type="submit" disabled={busy}>{busy ? 'Yoxlanılır…' : action === 'accept-invitation' ? 'Dəvəti qəbul et' : action === 'verify-email' ? 'E-poçtu təsdiqlə' : 'Şifrəni yenilə'}</Button></form>}</Panel></div></Page>;
}
