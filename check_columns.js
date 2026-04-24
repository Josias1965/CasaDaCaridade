import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync('.env', 'utf8');
const lines = envContent.split('\n');
const env = {};
lines.forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    env[key.trim()] = value.trim();
  }
});

const supabaseUrl = env.PUBLIC_SUPABASE_URL;
const supabaseKey = env.PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColumns() {
  const { data, error } = await supabase.from('posts').select('*').limit(1);
  if (error) {
    console.error('Error fetching post:', error);
  } else if (data && data.length > 0) {
    console.log('COLUMNS_START');
    console.log(JSON.stringify(Object.keys(data[0])));
    console.log('COLUMNS_END');
  } else {
    console.log('No posts found to check columns.');
  }
}

checkColumns();

