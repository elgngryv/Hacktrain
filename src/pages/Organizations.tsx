import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Building2, ArrowUpRight, Plus } from 'lucide-react';
import { api } from '@/lib/api/client';
import { type Organization, type PageResult } from '@/lib/api/organization';
import { Page, Panel, Failure, Pager, Notice, fieldClass } from '@/components/platform/Platform';
import { Button } from '@/components/ui/button';
export default function Organizations() {
  const [page, setPage] = useState(0); const client = useQueryClient();
  const query = useQuery({ queryKey: ['organizations', page], queryFn: ({ signal }) => api.request<PageResult<Organization>>(`/organizations?page=${page}&size=20`, 'GET', undefined, signal), retry: false });
  const create = useMutation({ mutationFn: (name: string) => api.request<Organization>('/organizations', 'POST', { name }), onSuccess: () => client.invalidateQueries({ queryKey: ['organizations'] }) });
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const form = event.currentTarget; try { await create.mutateAsync(String(new FormData(form).get('name')).trim()); form.reset(); } catch { /* The mutation error is rendered below. */ } }
  return <Page title="Təlim mərkəzləriniz" description="Üzv olduğunuz təşkilatları və sizə açıq qrupları buradan idarə edin.">
    <Panel title="Yeni təşkilat"><form onSubmit={submit} className="flex flex-col sm:flex-row gap-3"><label className="flex-1"><span className="sr-only">Təşkilatın adı</span><input name="name" required maxLength={120} pattern=".*\S.*" placeholder="Təlim mərkəzinin adı" className={fieldClass} /></label><Button type="submit" disabled={create.isPending}><Plus size={16} className="mr-2" />{create.isPending ? 'Yaradılır…' : 'Təşkilat yarat'}</Button></form><p className="text-xs text-muted-foreground">Hər hesab ən çox 3 təşkilat yarada bilər. Yaradıcıya administrator rolu verilir.</p>{create.error && <Failure error={create.error} />}</Panel>
    {query.isPending && <Notice>Təşkilatlar yüklənir…</Notice>}{query.error && <Failure error={query.error} retry={() => query.refetch()} />}
    {query.data && <><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{query.data.items.map(org => <Link key={org.id} to={`/organizations/${org.id}`} className="group border rounded-xl p-6 bg-card hover:border-primary/60 transition-colors"><div className="flex items-center justify-between mb-8"><Building2 className="text-primary" /><ArrowUpRight className="text-muted-foreground group-hover:text-primary" size={20} /></div><h2 className="text-lg font-semibold break-words">{org.name}</h2><p className="text-sm text-muted-foreground mt-2">{org.archived ? 'Arxivlənib · Yalnız baxış' : 'Qruplar və üzvlər →'}</p></Link>)}</div>{query.data.total === 0 && <Panel title="Hələ təşkilatınız yoxdur"><p className="text-muted-foreground">Yeni təşkilat yaradın və ya müəlliminizin göndərdiyi e-poçt dəvətini qəbul edin.</p></Panel>}<Pager page={page} total={query.data.total} setPage={setPage} /></>}
  </Page>;
}
