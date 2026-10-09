import { useState, type FormEvent } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { BookOpen, ArrowUpRight } from 'lucide-react';
import { api } from '@/lib/api/client';
import { type Member, type Organization, type PageResult } from '@/lib/api/organization';
import { type CourseSummary, difficultyNames, statusNames } from '@/lib/api/course';
import { Page, Panel, Failure, Pager, Notice, fieldClass } from '@/components/platform/Platform';
import { Button } from '@/components/ui/button';
export default function Courses() { const { orgId } = useParams(); return <CourseList key={orgId} orgId={orgId!} />; }
function CourseList({ orgId }: { orgId: string }) {
  const base = `/organizations/${orgId}`; const navigate = useNavigate(); const [page, setPage] = useState(0);
  const self = useQuery({ queryKey: ['organization', orgId, 'membership'], queryFn: ({ signal }) => api.request<Member>(`${base}/membership`, 'GET', undefined, signal), retry: false });
  const org = useQuery({ queryKey: ['organization', orgId], queryFn: ({ signal }) => api.request<Organization>(base, 'GET', undefined, signal), retry: false });
  const courses = useQuery({ queryKey: ['organization', orgId, 'courses', page], queryFn: ({ signal }) => api.request<PageResult<CourseSummary>>(`${base}/courses?page=${page}`, 'GET', undefined, signal), retry: false });
  const create = useMutation({ mutationFn: (body: unknown) => api.request<CourseSummary>(`${base}/courses`, 'POST', body), onSuccess: course => navigate(`${base}/courses/${course.id}`) });
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const data = new FormData(event.currentTarget); create.mutate({ title: String(data.get('title')).trim(), description: String(data.get('description')).trim(), difficulty: data.get('difficulty') }); }
  return <Page title="Kurslar" description={org.data ? `${org.data.name} · Öyrənmə məqsədləri ilə qurulmuş kurslar` : 'Kurs kataloqu'}><Link to={base} className="text-primary text-sm">← Təşkilata qayıt</Link>
    {(self.error || org.error) && <Failure error={self.error || org.error} retry={() => { self.refetch(); org.refetch(); }} />}
    {self.data && self.data.role !== 'STUDENT' && org.data && !org.data.archived && <Panel title="Yeni kurs"><form onSubmit={submit} className="space-y-4"><label className="block text-sm space-y-2"><span>Kursun adı</span><input name="title" required maxLength={160} pattern=".*\S.*" placeholder="Məsələn: Veb tətbiqlərinin təhlükəsizliyi" className={fieldClass} /></label><label className="block text-sm space-y-2"><span>Qısa təsvir</span><textarea name="description" maxLength={2000} rows={3} className={fieldClass} /></label><label className="block text-sm space-y-2"><span>Çətinlik</span><select name="difficulty" className={fieldClass}>{Object.entries(difficultyNames).map(([key, name]) => <option key={key} value={key}>{name}</option>)}</select></label><Button type="submit" disabled={create.isPending}>{create.isPending ? 'Yaradılır…' : 'Qaralama yarat'}</Button></form>{create.error && <Failure error={create.error} />}</Panel>}
    {courses.isPending && <Notice>Kurslar yüklənir…</Notice>}{courses.error && <Failure error={courses.error} retry={() => courses.refetch()} />}
    {courses.data && <><div className="grid sm:grid-cols-2 gap-4">{courses.data.items.map(course => <Link key={course.id} to={`${base}/courses/${course.id}`} className="border bg-card rounded-xl p-6 hover:border-primary transition-colors"><div className="flex items-center justify-between mb-5"><BookOpen className="text-primary" /><span className="text-xs text-muted-foreground">{statusNames[course.status]}</span></div><h2 className="text-xl font-semibold">{course.title}</h2><p className="text-sm text-muted-foreground line-clamp-3 my-3">{course.description}</p><div className="flex justify-between text-sm text-primary">{difficultyNames[course.difficulty]}<ArrowUpRight size={18} /></div></Link>)}</div>{!courses.data.total && <Panel title="Hələ görünən kurs yoxdur"><p className="text-muted-foreground text-sm">Tələbələrə kurslar yayımlandıqdan və onların qrupuna təyin edildikdən sonra açılır.</p></Panel>}<Pager page={page} total={courses.data.total} setPage={setPage} /></>}
  </Page>;
}
