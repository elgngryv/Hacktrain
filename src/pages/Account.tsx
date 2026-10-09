import { useState, type FormEvent } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { api, validatePassword } from '@/lib/api/client';
import { Page, Panel, Failure, Notice, fieldClass } from '@/components/platform/Platform';
import { Button } from '@/components/ui/button';
export default function Account() {
  const { user } = useAuth(); const [busy, setBusy] = useState(false); const [error, setError] = useState<unknown>();
  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const data = new FormData(event.currentTarget); const password = String(data.get('newPassword')); setError(undefined);
    if (!validatePassword(password) || password !== data.get('confirm')) { setError(new Error('Yeni şifrə ən azı 12 simvol, ən çox 72 UTF-8 bayt olmalı və təkrarı ilə uyğun gəlməlidir.')); return; }
    setBusy(true); try { await api.request('/auth/change-password', 'POST', { currentPassword: data.get('currentPassword'), newPassword: password }); api.clear(); } catch (error) { setError(error); } finally { setBusy(false); }
  }
  async function logoutAll() { setBusy(true); setError(undefined); try { await api.request('/auth/logout-all', 'POST'); api.clear(); } catch (error) { setError(error); } finally { setBusy(false); } }
  return <Page title="Hesabınız" description="Şəxsi hesab və sessiya təhlükəsizliyi.">{error && <Failure error={error} />}<Panel title="Hesab məlumatları"><p className="break-all">{user.email}</p><Notice>E-poçt təsdiqi tələb olunmur.</Notice><p className="text-xs font-mono text-muted-foreground break-all">{user.id}</p></Panel><Panel title="Şifrəni dəyiş"><form className="space-y-4 max-w-lg" onSubmit={changePassword}>{[{ name: 'currentPassword', label: 'Cari şifrə', auto: 'current-password' }, { name: 'newPassword', label: 'Yeni şifrə', auto: 'new-password' }, { name: 'confirm', label: 'Yeni şifrənin təkrarı', auto: 'new-password' }].map(field => <label key={field.name} className="block text-sm space-y-2"><span>{field.label}</span><input className={fieldClass} name={field.name} type="password" required autoComplete={field.auto} /></label>)}<p className="text-xs text-muted-foreground">Dəyişiklik bütün sessiyaları bitirəcək. Yeni şifrə ilə təkrar daxil olun.</p><Button disabled={busy} type="submit">Şifrəni yenilə</Button></form></Panel><Panel title="Sessiyalar"><p className="text-sm text-muted-foreground">Bütün cihazlarda aktiv sessiyalarınızı bitirin.</p><Button variant="outline" disabled={busy} onClick={logoutAll}>Bütün sessiyalardan çıx</Button></Panel></Page>;
}
