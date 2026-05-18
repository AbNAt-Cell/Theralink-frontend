const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function createAbba() {
  const email = 'abbaonogu@gmail.com';
  const password = 'TemporaryPassword123!';
  const firstName = 'Abba';
  const lastName = 'Onogu';

  console.log(`Attempting to sign up ${email}...`);
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        role: 'CLIENT'
      }
    }
  });

  if (error) {
    console.error('Sign up error:', error.message);
    return;
  }

  console.log('Successfully created user!');
  console.log('Login Details:');
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
  console.log('\nNOTE: If email confirmations are enabled in Supabase, an email was just sent to them.');
}

createAbba();
