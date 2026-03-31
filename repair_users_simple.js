import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cigimcctmbdjpjjhztxe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpZ2ltY2N0bWJkanBqamh6dHhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4Mjg1MjIsImV4cCI6MjA5MDQwNDUyMn0.WGliy-gXKJinADszcGPxXzQAqH-JImhJi3PGsRwznXw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function repair() {
  console.log('--- REPARO DE USUÁRIOS (SIMPLES) ---');
  
  const ids = [
    { id: 'c2355965-40d0-4909-8453-eaea8d59b880', name: 'Josias' },
    { id: '8f549b49-4bc0-4e50-9c63-0d65c5770f16', name: 'Admin' }
  ];

  for (const user of ids) {
    const { error } = await supabase
      .from('user_profiles')
      .upsert([{ 
        id: user.id, 
        display_name: user.name, 
        role_id: 1 // Admin
      }], { onConflict: 'id' });

    if (error) console.log(`Erro ao inserir ${user.name}:`, error.message);
    else console.log(`Sucesso: ${user.name} está no banco.`);
  }
}

repair();
