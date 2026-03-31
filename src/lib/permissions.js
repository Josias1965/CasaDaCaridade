// src/lib/permissions.js
import { supabase } from './supabase.js';

export async function checkPermission(userId, resource, action) {
  // Buscar role do usuário
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

  const permissions = profile.roles.permissions;
  
  // Verificar se tem permissão
  return permissions[resource]?.includes(action) || false;
}

export async function requireAuth(cookies) {
  const accessToken = cookies.get('sb-access-token');
  
  if (!accessToken) {
    return { authorized: false, user: null };
  }

  const { data: { user }, error } = await supabase.auth.getUser(
    accessToken.value
  );

  if (error || !user) {
    return { authorized: false, user: null };
  }

  return { authorized: true, user };
}

export async function requirePermission(userId, resource, action) {
  const hasPermission = await checkPermission(userId, resource, action);
  
  if (!hasPermission) {
    throw new Error('Permissão negada');
  }
  
  return true;
}
