import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cigimcctmbdjpjjhztxe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpZ2ltY2N0bWJkanBqamh6dHhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4Mjg1MjIsImV4cCI6MjA5MDQwNDUyMn0.WGliy-gXKJinADszcGPxXzQAqH-JImhJi3PGsRwznXw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  console.log('Checking tables...');
  // Try retrieving from 'posts'
  const { data: posts, error: postsError } = await supabase.from('posts').select('*').limit(1);
  if (postsError) {
    console.log('Error with table "posts":', postsError.message);
  } else {
    console.log('Table "posts" OK');
  }

  // Try retrieving from 'Postagens'
  const { data: postagens, error: postagensError } = await supabase.from('Postagens').select('*').limit(1);
  if (postagensError) {
    console.log('Error with table "Postagens":', postagensError.message);
  } else {
    console.log('Table "Postagens" OK');
  }
}

checkTables();
