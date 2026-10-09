import { useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { type Organization, type Group, type Member, type Invitation, type PageResult, roleNames, type Role } from '@/lib/api/organization';
import { Page, Panel, Failure, Pager, Notice, fieldClass } from '@/components/platform/Platform';
import { Button } from '@/components/ui/button';
function RoleSelect({ name = 'role', value = 'STUDENT' }: { name?: string; value?: Role }) { return <select aria-label="Rol" name={name} defaultValue={value} className={fieldClass}>{Object.entries(roleNames).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select>; }
export default function OrganizationDetail() {
  const { orgId } = useParams();
  return <OrganizationContent key={orgId} orgId={orgId!} />;
}
function OrganizationContent({ orgId }: { orgId: string }) {
  const base = `/organizations/${orgId}`; const client = useQueryClient();
  const [groupPage, setGroupPage] = useState(0); const [memberPage, setMemberPage] = useState(0); const [invitePage, setInvitePage] = useState(0);
  const org = useQuery({ queryKey: ['organization', orgId], queryFn: ({ signal }) => api.request<Organization>(base, 'GET', undefined, signal), retry: false });
  const self = useQuery({ queryKey: ['organization', orgId, 'membership'], queryFn: ({ signal }) => api.request<Member>(`${base}/membership`, 'GET', undefined, signal), retry: false });
  const admin = self.data?.role === 'ORG_ADMIN'; const editable = admin && !org.data?.archived;
  const groups = useQuery({ queryKey: ['organization', orgId, 'groups', groupPage], queryFn: ({ signal }) => api.request<PageResult<Group>>(`${base}/groups?page=${groupPage}`, 'GET', undefined, signal), enabled: !!self.data, retry: false });
  const members = useQuery({ queryKey: ['organization', orgId, 'members', memberPage], queryFn: ({ signal }) => api.request<PageResult<Member>>(`${base}/members?page=${memberPage}`, 'GET', undefined, signal), enabled: admin, retry: false });
  const invitations = useQuery({ queryKey: ['organization', orgId, 'invitations', invitePage], queryFn: ({ signal }) => api.request<PageResult<Invitation>>(`${base}/invitations?page=${invitePage}`, 'GET', undefined, signal), enabled: admin, retry: false });
  const mutation = useMutation({ mutationFn: ({ path, method, body }: { path: string; method: string; body?: unknown }) => api.request(base + path, method, body), onSuccess: async () => { await client.invalidateQueries({ queryKey: ['organization', orgId] }); await client.invalidateQueries({ queryKey: ['organizations'] }); } });
  async function submit(event: FormEvent<HTMLFormElement>, path: string, method: string, make: (data: FormData) => unknown) { event.preventDefault(); const form = event.currentTarget; try { await mutation.mutateAsync({ path, method, body: make(new FormData(form)) }); if (method === 'POST') form.reset(); } catch { /* Error stays in the page alert. */ } }
  function action(path: string, method: string) { mutation.mutate({ path, method }); }
  if (org.isPending || self.isPending) return <Page title="Təşkilat"><Notice>Yüklənir…</Notice></Page>;
  if (org.error || self.error) return <Page title="Təşkilat"><Failure error={org.error || self.error} retry={() => { org.refetch(); self.refetch(); }} /><Link to="/organizations">← Təşkilatlar</Link></Page>;
  return <Page title={org.data.name} description={`Rolunuz: ${roleNames[self.data.role]}. ${org.data.archived ? 'Təşkilat arxivdədir.' : 'Təlim qruplarını və komandanızı idarə edin.'}`}>
    <Link className="text-sm text-primary inline-block" to="/organizations">← Bütün təşkilatlar</Link>
    {mutation.error && <Failure error={mutation.error} />}{mutation.isSuccess && <Notice>Dəyişiklik yadda saxlandı.</Notice>}
    <Panel title="Kurslar"><p className="text-sm text-muted-foreground">Mövzular, tapşırıqlar və öyrənmə məqsədləri.</p><Button asChild><Link to={`${base}/courses`}>Kursları aç</Link></Button></Panel>
    <Panel title="Qruplar">
      {editable && <form onSubmit={event => submit(event, '/groups', 'POST', data => ({ name: String(data.get('name')).trim() }))} className="flex flex-col sm:flex-row gap-3"><input aria-label="Yeni qrupun adı" name="name" required maxLength={120} pattern=".*\S.*" placeholder="Məsələn: Veb təhlükəsizliyi · Payız" className={fieldClass} /><Button type="submit" disabled={mutation.isPending}>Qrup yarat</Button></form>}
      {groups.isPending && <Notice>Qruplar yüklənir…</Notice>}{groups.error && <Failure error={groups.error} retry={() => groups.refetch()} />}
      {groups.data && <><div className="grid sm:grid-cols-2 gap-3">{groups.data.items.map(group => <Link key={group.id} className="border rounded-lg p-4 hover:border-primary" to={`${base}/groups/${group.id}`}><h3 className="font-medium">{group.name}</h3><p className="text-xs text-muted-foreground mt-2">{group.archived ? 'Arxivlənib' : 'Qrupa bax →'}</p></Link>)}</div>{groups.data.total === 0 && <p className="text-muted-foreground text-sm">Sizə açıq qrup yoxdur.</p>}<Pager page={groupPage} total={groups.data.total} setPage={setGroupPage} /></>}
    </Panel>
    {admin && <><Panel title="Üzvlər">
      <p className="text-xs text-muted-foreground">Üzv identifikatorları hesabların UUID-ləridir. Son administratorun hüquqları server tərəfindən qorunur.</p>
      {members.isPending && <Notice>Üzvlər yüklənir…</Notice>}{members.error && <Failure error={members.error} retry={() => members.refetch()} />}
      {members.data && <><div className="space-y-3">{members.data.items.map(member => <form key={`${member.id}-${member.version}`} onSubmit={event => submit(event, `/members/${member.id}`, 'PATCH', data => ({ role: data.get('role'), status: data.get('status'), version: member.version }))} className="border rounded-lg p-4 space-y-3"><p className="text-xs font-mono break-all">{member.userId}{member.userId === self.data.userId ? ' (siz)' : ''}</p><fieldset disabled={!editable || mutation.isPending} className="flex flex-col sm:flex-row gap-3"><RoleSelect value={member.role} /><select aria-label="Üzvlük statusu" name="status" defaultValue={member.status} className={fieldClass}><option value="ACTIVE">Aktiv</option><option value="INACTIVE">Deaktiv</option></select><Button type="submit" variant="outline">Yadda saxla</Button></fieldset></form>)}</div><Pager page={memberPage} total={members.data.total} setPage={setMemberPage} /></>}
    </Panel><Panel title="E-poçt dəvətləri">
      {editable && <form className="grid sm:grid-cols-[1fr_1fr_auto] gap-3" onSubmit={event => submit(event, '/invitations', 'POST', data => ({ email: String(data.get('email')).trim(), role: data.get('role') }))}><input aria-label="Dəvət edilənin e-poçtu" name="email" type="email" required maxLength={254} placeholder="telebe@example.com" className={fieldClass} /><RoleSelect /><Button type="submit" disabled={mutation.isPending}>Dəvət göndər</Button></form>}
      {invitations.isPending && <Notice>Dəvətlər yüklənir…</Notice>}{invitations.error && <Failure error={invitations.error} retry={() => invitations.refetch()} />}
      {invitations.data && <><ul className="divide-y">{invitations.data.items.map(invite => { const pending = !invite.revoked && !invite.consumedAt && Date.parse(invite.expiresAt) > Date.now(); return <li key={invite.id} className="py-4 flex flex-wrap items-center justify-between gap-3"><div><p className="break-all">{invite.email}</p><p className="text-xs text-muted-foreground mt-1">{roleNames[invite.role]} · {invite.consumedAt ? 'Qəbul edilib' : invite.revoked ? 'Ləğv edilib' : pending ? 'Gözləyir' : 'Müddəti bitib'}</p></div>{editable && pending && <Button variant="outline" disabled={mutation.isPending} onClick={() => action(`/invitations/${invite.id}`, 'DELETE')}>Dəvəti ləğv et</Button>}</li>; })}</ul>{!invitations.data.total && <p className="text-sm text-muted-foreground">Hələ dəvət göndərilməyib.</p>}<Pager page={invitePage} total={invitations.data.total} setPage={setInvitePage} /></>}
    </Panel>{editable && <Panel title="Təşkilatın adı"><form className="flex flex-col sm:flex-row gap-3" onSubmit={event => submit(event, '', 'PATCH', data => ({ name: String(data.get('name')).trim(), version: org.data.version }))}><input key={org.data.version} aria-label="Təşkilatın adı" name="name" defaultValue={org.data.name} required maxLength={120} pattern=".*\S.*" className={fieldClass} /><Button disabled={mutation.isPending} type="submit">Yenilə</Button></form></Panel>}</>}
  </Page>;
}
