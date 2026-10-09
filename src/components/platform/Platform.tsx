import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { errorMessage } from '@/lib/api/client';
export function RequireAuth({ children }: { children: ReactNode }) {
  const { user } = useAuth(); const location = useLocation();
  return user ? <>{children}</> : <Navigate to="/auth" replace state={{ returnTo: location.pathname }} />;
}
export function Page({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return <main className="max-w-6xl mx-auto px-4 sm:px-8 py-12 min-h-[70vh]"><p className="text-primary text-xs font-mono tracking-[0.2em] mb-3">HACKTRAIN / ÖYRƏNMƏ MƏRKƏZİ</p><h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">{title}</h1>{description && <p className="text-muted-foreground max-w-2xl mb-8 leading-relaxed">{description}</p>}<div className="space-y-6">{children}</div></main>;
}
export function Panel({ title, children }: { title: string; children: ReactNode }) {
  return <section className="rounded-xl border border-border bg-card p-5 sm:p-7 space-y-5"><h2 className="text-lg font-semibold">{title}</h2>{children}</section>;
}
export function Failure({ error, retry }: { error: unknown; retry?: () => void }) {
  return <div role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm"><p>{errorMessage(error)}</p>{retry && <Button className="mt-3" variant="outline" onClick={retry}>Yenidən yoxla</Button>}</div>;
}
export function Notice({ children }: { children: ReactNode }) { return <p role="status" className="text-sm border border-primary/30 bg-primary/5 rounded-lg p-4">{children}</p>; }
export function Pager({ page, total, size = 20, setPage }: { page: number; total: number; size?: number; setPage: (page: number) => void }) {
  return <div className="flex items-center justify-between gap-3 text-sm"><span className="text-muted-foreground">{total} nəticə · Səhifə {page + 1}</span><div className="flex gap-2"><Button variant="outline" disabled={page === 0} onClick={() => setPage(page - 1)}>Əvvəlki</Button><Button variant="outline" disabled={(page + 1) * size >= total} onClick={() => setPage(page + 1)}>Növbəti</Button></div></div>;
}
export const fieldClass = 'w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring';
