import { createContext, useContext, useEffect, useState, useRef, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { api, type Profile, type Tokens } from '@/lib/api/client';
interface AuthContextType {
  user: Profile | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('AuthProvider is required');
  return context;
}
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const client = useQueryClient();
  const epoch = useRef(0);
  useEffect(() => {
    // Discard the legacy UI-only identity; it never proves authentication.
    localStorage.removeItem('user');
    api.onSessionEnd = () => { epoch.current++; setUser(null); client.clear(); };
    return () => { api.onSessionEnd = () => {}; };
  }, [client]);
  async function signIn(email: string, password: string) {
    const current = ++epoch.current;
    const tokens = await api.publicRequest<Tokens>('/auth/login', { email, password });
    if (current !== epoch.current) return;
    api.establish(tokens);
    try {
      const profile = await api.request<Profile>('/auth/me');
      if (current === epoch.current) { client.clear(); setUser(profile); }
    } catch (error) { api.clear(); throw error; }
  }
  return <AuthContext.Provider value={{ user, signIn, signOut: () => api.logout() }}>{children}</AuthContext.Provider>;
}
