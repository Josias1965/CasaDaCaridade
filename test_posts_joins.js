import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cigimcctmbdjpjjhztxe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpZ2ltY2N0bWJkanBqamh6dHhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4Mjg1MjIsImV4cCI6MjA5MDQwNDUyMn0.WGliy-gXKJinADszcGPxXzQAqH-JImhJi3PGsRwznXw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPostsWithJoins() {
  const { data, error } = await supabase
    .from('posts')
    .select(`
        *,
        categories (name, slug),
        user_profiles (display_name)
    `)
    .eq('status', 'published');
    
  if (error) {
    console.log('Error:', error.message);
  } else {
    console.log('Posts:', JSON.stringify(data, null, 2));
  }
}

checkPostsWithJoins();
