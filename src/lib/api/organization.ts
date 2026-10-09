export interface PageResult<T> { items: T[]; page: number; size: number; total: number }
export interface Organization { id: string; name: string; archived: boolean; version: number; createdAt: string }
export type Group = Organization;
export type Role = 'STUDENT' | 'TEACHER' | 'ORG_ADMIN';
export interface Member { id: string; organizationId: string; userId: string; role: Role; status: 'ACTIVE' | 'INACTIVE'; version: number; createdAt: string }
export interface Invitation { id: string; email: string; role: Role; expiresAt: string; consumedAt: string | null; revoked: boolean; createdAt: string }
export const roleNames: Record<Role, string> = { STUDENT: 'Tələbə', TEACHER: 'Müəllim', ORG_ADMIN: 'Təşkilat administratoru' };
