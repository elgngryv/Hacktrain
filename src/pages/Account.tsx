import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api/client';
import { Page, Panel, Failure, Notice } from '@/components/platform/Platform';
import { Button } from '@/components/ui/button';
export default function Account() {
  const { user } = useAuth(); const [busy, setBusy] = useState(false); const [error, setError] = useState<unknown>();
  async function logoutAll() { setBusy(true); setError(undefined); try { await api.request('/auth/logout-all', 'POST'); api.clear(); } catch (error) { setError(error); } finally { setBusy(false); } }
  return <Page title="Hesabınız" description="Şəxsi hesab və sessiya təhlükəsizliyi.">{error && <Failure error={error} />}<Panel title="Hesab məlumatları"><p className="break-all">{user.email}</p><Notice>Sabit hesabla giriş aktivdir.</Notice><p className="text-xs font-mono text-muted-foreground break-all">{user.id}</p></Panel><Panel title="Sessiyalar"><p className="text-sm text-muted-foreground">Bütün cihazlarda aktiv sessiyalarınızı bitirin.</p><Button variant="outline" disabled={busy} onClick={logoutAll}>Bütün sessiyalardan çıx</Button></Panel></Page>;
}
