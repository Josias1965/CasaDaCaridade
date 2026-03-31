import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cigimcctmbdjpjjhztxe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpZ2ltY2N0bWJkanBqamh6dHhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4Mjg1MjIsImV4cCI6MjA5MDQwNDUyMn0.WGliy-gXKJinADszcGPxXzQAqH-JImhJi3PGsRwznXw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUserProfiles() {
  const { data, error } = await supabase.from('user_profiles').select('*');
  if (error) {
    console.log('Error with user_profiles:', error.message);
  } else {
    console.log('User profiles:', data.length);
    data.forEach(p => console.log(`Profile: ${p.id}, Role ID: ${p.role_id}`));
  }
}

checkUserProfiles();
