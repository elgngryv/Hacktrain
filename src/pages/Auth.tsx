import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Failure, fieldClass } from '@/components/platform/Platform';
export default function Auth() {
  const location = useLocation(); const navigate = useNavigate(); const { user, signIn } = useAuth();
  const [busy, setBusy] = useState(false); const [error, setError] = useState<unknown>();
  const destination = typeof location.state?.returnTo === 'string' && /^\/(organizations|account|ai)(\/|$)/.test(location.state.returnTo) ? location.state.returnTo : '/organizations';
  if (user) return <Navigate to={destination} replace />;
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy) return;
    const form = new FormData(event.currentTarget); const email = String(form.get('email')).trim(); const password = String(form.get('password') ?? '');
    setError(undefined);
    setBusy(true);
    try {
      await signIn(email, password); navigate(destination, { replace: true });
    } catch (error) { setError(error); } finally { setBusy(false); }
  }
  return <main className="max-w-6xl mx-auto px-5 py-16 grid lg:grid-cols-2 gap-12 items-center min-h-[75vh]">
    <section className="space-y-7"><div className="inline-flex gap-2 items-center rounded-full border border-primary/30 px-4 py-2 text-primary text-sm"><ShieldCheck size={16} /> Təhlükəsiz təcrübə, ölçülə bilən inkişaf</div><h1 className="text-4xl sm:text-5xl font-bold leading-tight">Bilikdən bacarığa.<br /><span className="text-primary">HackTrain ilə.</span></h1><p className="text-muted-foreground max-w-md leading-relaxed">Təlim mərkəzinizə qoşulun, qruplarınızı bir yerdə idarə edin və öyrənmə yolunuza davam edin.</p><div className="border-l-2 border-primary pl-5 text-sm text-muted-foreground">Hesabınız və təşkilatdakı rolunuz server tərəfindən yoxlanılır.</div></section>
    <section className="bg-card border rounded-2xl p-6 sm:p-9 space-y-6"><h2 className="text-2xl font-semibold">Daxil ol</h2>
      {error && <Failure error={error} />}
      <form onSubmit={submit} className="space-y-4"><label className="block text-sm space-y-2"><span>E-poçt</span><input name="email" defaultValue="elgun@gmail.com" type="email" autoComplete="email" required maxLength={254} className={fieldClass} /></label>
      <label className="block text-sm space-y-2"><span>Şifrə</span><input name="password" type="password" autoComplete="current-password" required minLength={1} maxLength={72} className={fieldClass} /></label>
      <Button className="w-full" disabled={busy} type="submit">{busy ? 'Göndərilir…' : 'Daxil ol'}<ArrowRight size={16} className="ml-2" /></Button></form>
      <p className="text-xs text-muted-foreground">Sessiya yalnız bu açıq səhifədə saxlanılır. Səhifəni yenilədikdə yenidən daxil olmaq lazımdır.</p><Link to="/" className="text-sm text-muted-foreground hover:text-primary block">← Əsas səhifəyə qayıt</Link>
    </section></main>;
}
