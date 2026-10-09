import { useState, type FormEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Sparkles, MessageCircle } from 'lucide-react';
import { api } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Failure, fieldClass } from './Platform';
interface Answer {
  requestId: string; fallback: boolean; source: string; provider: string; model: string; promptVersion: string; message: string;
  hint: { difficulty: string; evidenceAttemptIds: string[]; needsClarification: boolean; clarifyingQuestion: string | null; hintLevel: number; hintText: string; confidence: number };
}
interface Availability { configured: boolean; provider: string; model: string; allowedHintLevel: number; mode: string }
export default function AiTutor({ orgId, courseId, taskId }: { orgId: string; courseId: string; taskId: string }) {
  const [explanation, setExplanation] = useState(''); const [busy, setBusy] = useState(false); const [answer, setAnswer] = useState<Answer>(); const [error, setError] = useState<unknown>();
  const status = useQuery({ queryKey: ['ai-status'], queryFn: ({ signal }) => api.request<Availability>('/ai/status', 'GET', undefined, signal), staleTime: 30000, retry: false });
  async function ask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy) return; setBusy(true); setError(undefined); setAnswer(undefined);
    try { setAnswer(await api.request<Answer>(`/organizations/${orgId}/courses/${courseId}/tasks/${taskId}/ai/hint`, 'POST', { explanation: explanation.trim() })); }
    catch (error) { setError(error); } finally { setBusy(false); }
  }
  return <section className="mt-5 border border-primary/30 rounded-xl bg-primary/5 p-5 space-y-4" aria-label="AI təlim köməkçisi"><div className="flex flex-wrap gap-2 items-center justify-between"><h4 className="font-semibold flex gap-2 items-center"><Sparkles size={18} className="text-primary" />AI təlim köməkçisi</h4><span className="text-xs text-muted-foreground">Səviyyə 1 · Düşündürən sual</span></div>
    {status.error && <Failure error={status.error} retry={() => status.refetch()} />}
    {status.data && !status.data.configured && <p className="text-xs text-muted-foreground">AI bağlantısı aktiv deyil. Hazırda yalnız sabit təlim sualı göstərilə bilər.</p>}
    <form onSubmit={ask} className="space-y-3"><label className="block text-sm space-y-2"><span>Harada çətinlik çəkirsiniz? Sınadığınız addımı və gözlədiyiniz nəticəni izah edin.</span><textarea required minLength={3} maxLength={3000} rows={3} value={explanation} onChange={e => setExplanation(e.target.value)} className={fieldClass} /></label><p className="text-xs text-muted-foreground">İzahınız və tapşırığın öyrənmə məqsədləri AI provayderinə göndərilir. Şifrə və şəxsi məlumat daxil etməyin.</p><Button type="submit" disabled={busy || explanation.trim().length < 3}><MessageCircle size={16} className="mr-2" />{busy ? 'Cavab hazırlanır…' : 'İpucu al'}</Button></form>
    {busy && <p role="status" className="text-sm text-muted-foreground">AI düşünür…</p>}{error && <Failure error={error} />}
    {answer && <div role="status" className="rounded-lg border bg-background p-4 space-y-3"><span className={`inline-block rounded-full px-3 py-1 text-xs ${answer.fallback ? 'bg-secondary text-muted-foreground' : 'bg-primary/15 text-primary'}`}>{answer.fallback ? 'Sabit ipucu · AI cavabı deyil' : `AI cavabı · ${answer.model}`}</span><p className="text-sm whitespace-pre-wrap leading-relaxed">{answer.hint.hintText}</p>{answer.hint.needsClarification && <p className="text-sm font-medium">{answer.hint.clarifyingQuestion}</p>}<p className="text-xs text-muted-foreground">{answer.message}</p></div>}
  </section>;
}
