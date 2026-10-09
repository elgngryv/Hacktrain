import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { api, validatePassword } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Failure, Notice, fieldClass } from '@/components/platform/Platform';
type Mode = 'login' | 'register' | 'forgot-password';
export default function Auth() {
  const location = useLocation(); const navigate = useNavigate(); const { user, signIn } = useAuth();
  const [mode, setMode] = useState<Mode>(location.state?.fromNav === 'register' ? 'register' : 'login');
  const [busy, setBusy] = useState(false); const [error, setError] = useState<unknown>(); const [notice, setNotice] = useState('');
  const destination = typeof location.state?.returnTo === 'string' && /^\/(organizations|account|ai)(\/|$)/.test(location.state.returnTo) ? location.state.returnTo : '/organizations';
  if (user) return <Navigate to={destination} replace />;
  const titles: Record<Mode, string> = { login: 'Yenidən xoş gəldiniz.', register: 'Öyrənməyə başlayın.', 'forgot-password': 'Şifrənizi bərpa edin.' };
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy) return;
    const form = new FormData(event.currentTarget); const email = String(form.get('email')).trim(); const password = String(form.get('password') ?? '');
    setError(undefined); setNotice('');
    if (mode === 'register' && (!validatePassword(password) || password !== form.get('confirm'))) { setError(new Error('Şifrə ən azı 12 simvol, ən çox 72 UTF-8 bayt olmalı və təkrarı ilə uyğun gəlməlidir.')); return; }
    setBusy(true);
    try {
      if (mode === 'login') { await signIn(email, password); navigate(destination, { replace: true }); }
      else if (mode === 'register') { await api.publicRequest('/auth/register', { email, password }); await signIn(email, password); navigate(destination, { replace: true }); }
      else { await api.publicRequest('/auth/forgot-password', { email }); setNotice('Uyğun hesab varsa, şifrə bərpası üçün e-poçt göndəriləcək.'); }
    } catch (error) { setError(error); } finally { setBusy(false); }
  }
  return <main className="max-w-6xl mx-auto px-5 py-16 grid lg:grid-cols-2 gap-12 items-center min-h-[75vh]">
    <section className="space-y-7"><div className="inline-flex gap-2 items-center rounded-full border border-primary/30 px-4 py-2 text-primary text-sm"><ShieldCheck size={16} /> Təhlükəsiz təcrübə, ölçülə bilən inkişaf</div><h1 className="text-4xl sm:text-5xl font-bold leading-tight">Bilikdən bacarığa.<br /><span className="text-primary">HackTrain ilə.</span></h1><p className="text-muted-foreground max-w-md leading-relaxed">Təlim mərkəzinizə qoşulun, qruplarınızı bir yerdə idarə edin və öyrənmə yolunuza davam edin.</p><div className="border-l-2 border-primary pl-5 text-sm text-muted-foreground">Hesabınız və təşkilatdakı rolunuz server tərəfindən yoxlanılır.</div></section>
    <section className="bg-card border rounded-2xl p-6 sm:p-9 space-y-6"><h2 className="text-2xl font-semibold">{titles[mode]}</h2>
      <div className="flex gap-2">{(['login', 'register'] as const).map(value => <Button key={value} disabled={busy} variant={mode === value ? 'default' : 'outline'} onClick={() => { setMode(value); setError(undefined); setNotice(''); }}>{value === 'login' ? 'Daxil ol' : 'Qeydiyyat'}</Button>)}</div>
      {error && <Failure error={error} />}{notice && <Notice>{notice}</Notice>}
      <form key={mode} onSubmit={submit} className="space-y-4"><label className="block text-sm space-y-2"><span>E-poçt</span><input name="email" type="email" autoComplete="email" required maxLength={254} className={fieldClass} /></label>
      {(mode === 'login' || mode === 'register') && <label className="block text-sm space-y-2"><span>Şifrə</span><input name="password" type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} required minLength={mode === 'register' ? 12 : 1} maxLength={72} className={fieldClass} />{mode === 'register' && <span className="text-muted-foreground block text-xs">Ən azı 12 simvol, ən çox 72 UTF-8 bayt.</span>}</label>}
      {mode === 'register' && <label className="block text-sm space-y-2"><span>Şifrənin təkrarı</span><input name="confirm" type="password" autoComplete="new-password" required className={fieldClass} /></label>}
      <Button className="w-full" disabled={busy} type="submit">{busy ? 'Göndərilir…' : mode === 'login' ? 'Daxil ol' : mode === 'register' ? 'Hesab yarat' : 'Təlimatı göndər'}<ArrowRight size={16} className="ml-2" /></Button></form>
      <div className="flex flex-wrap gap-4 text-sm"><button disabled={busy} className="text-primary hover:underline" onClick={() => { setMode('forgot-password'); setError(undefined); setNotice(''); }}>Şifrəni unutmusunuz?</button></div>
      {mode === 'register' && <p className="text-sm text-muted-foreground">Təsdiq məktubu və kod tələb olunmur. Qeydiyyatdan sonra birbaşa daxil olacaqsınız.</p>}
      <p className="text-xs text-muted-foreground">Sessiya yalnız bu açıq səhifədə saxlanılır. Səhifəni yenilədikdə yenidən daxil olmaq lazımdır.</p><Link to="/" className="text-sm text-muted-foreground hover:text-primary block">← Əsas səhifəyə qayıt</Link>
    </section></main>;
}
