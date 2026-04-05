// src/lib/permissions.js
import { supabase } from './supabase.js';

/**
 * Mapa de permissões por role.
 * Editor: pode criar, ler e editar posts/categorias, mas NÃO pode excluir.
 * Admin: acesso total.
 * Author: só pode criar e ler (rascunho), sem publicar nem excluir.
 */
export const ROLE_PERMISSIONS = {
  admin: {
    posts:      ['create', 'read', 'update', 'delete', 'publish'],
    categories: ['create', 'read', 'update', 'delete'],
    users:      ['manage'],
  },
  editor: {
    posts:      ['create', 'read', 'update', 'publish'],  // SEM delete
    categories: ['create', 'read', 'update'],              // SEM delete
    users:      [],
  },
  author: {
    posts:      ['create', 'read'],  // só rascunho, sem publicar nem excluir
    categories: ['read'],
    users:      [],
  },
};

/**
 * Busca o role do usuário no banco e verifica se tem a permissão solicitada.
 */
export async function checkPermission(userId, resource, action) {
  const { data: profile } = await supabase
    .from('user_profiles')
    .select(`
      role_id,
      roles (
        name,
        permissions
      )
    `)
    .eq('id', userId)
    .single();

  if (!profile) return false;

  const roleName = profile.roles?.name?.toLowerCase();

  // Primeiro tenta pelo mapa local (mais confiável)
  if (ROLE_PERMISSIONS[roleName]) {
    return ROLE_PERMISSIONS[roleName][resource]?.includes(action) ?? false;
  }

  // Fallback: usa permissions salvas no banco
  const permissions = profile.roles?.permissions;
  if (!permissions) return false;
  return permissions[resource]?.includes(action) ?? false;
}

/**
 * Busca o role do usuário a partir do token de sessão.
 * Retorna { authorized, user, role, canDelete }
 */
export async function requireAuth(cookies) {
  const accessToken = cookies.get('sb-access-token');
  
  if (!accessToken) {
    return { authorized: false, user: null, role: null, canDelete: false };
  }

  const { data: { user }, error } = await supabase.auth.getUser(accessToken.value);

  if (error || !user) {
    return { authorized: false, user: null, role: null, canDelete: false };
  }

  // Busca o role do usuário
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('roles(name)')
    .eq('id', user.id)
    .single();

  const roleName = (
    Array.isArray(profile?.roles) ? profile.roles[0]?.name : profile?.roles?.name
  )?.toLowerCase() ?? 'author';

  const canDelete = ROLE_PERMISSIONS[roleName]?.posts?.includes('delete') ?? false;

  return { authorized: true, user, role: roleName, canDelete };
}

export async function requirePermission(userId, resource, action) {
  const hasPermission = await checkPermission(userId, resource, action);
  
  if (!hasPermission) {
    throw new Error('Permissão negada');
  }
  
  return true;
}
