const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function createSchema() {
  console.log('🔍 Creating better_auth schema...');

  // Following our global rules about secure API handling
  const requiredVars = {
    'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL?.trim(),
    'SUPABASE_SERVICE_ROLE_KEY': process.env.SUPABASE_SERVICE_ROLE_KEY?.trim(),
  };

  const missingVars = Object.entries(requiredVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingVars.join(', '));
    return;
  }

  // Initialize Supabase client with service role key
  const supabase = createClient(
    requiredVars.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  try {
    console.log('1️⃣ Testing connection...');
    
    // First verify we can connect
    const { data: testData, error: testError } = await supabase
      .from('_prisma_migrations')
      .select('*')
      .limit(1);

    if (testError && !testError.message.includes('relation "public._prisma_migrations" does not exist')) {
      throw testError;
    }
    console.log('✅ Connected successfully');

    // Try to create schema using REST API
    console.log('\n2️⃣ Creating schema...');
    
    // Create a stored procedure to handle schema creation
    const createProcedure = `
      CREATE OR REPLACE PROCEDURE create_better_auth_schema()
      LANGUAGE plpgsql
      AS $$
      BEGIN
        -- Create schema if it doesn't exist
        CREATE SCHEMA IF NOT EXISTS better_auth;
        
        -- Grant necessary permissions
        GRANT USAGE ON SCHEMA better_auth TO postgres;
        GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA better_auth TO postgres;
        GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA better_auth TO postgres;
        
        -- Set default privileges for future objects
        ALTER DEFAULT PRIVILEGES IN SCHEMA better_auth 
          GRANT ALL ON TABLES TO postgres;
        
        ALTER DEFAULT PRIVILEGES IN SCHEMA better_auth 
          GRANT ALL ON SEQUENCES TO postgres;
      END;
      $$;
    `;

    // First try to create the stored procedure
    const { error: procError } = await supabase.rpc('exec', { sql: createProcedure });
    
    if (procError) {
      // If we can't create the procedure, try direct SQL execution
      const { error: sqlError } = await supabase.rpc('exec', {
        sql: `
          CREATE SCHEMA IF NOT EXISTS better_auth;
          GRANT USAGE ON SCHEMA better_auth TO postgres;
          GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA better_auth TO postgres;
          GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA better_auth TO postgres;
          ALTER DEFAULT PRIVILEGES IN SCHEMA better_auth GRANT ALL ON TABLES TO postgres;
          ALTER DEFAULT PRIVILEGES IN SCHEMA better_auth GRANT ALL ON SEQUENCES TO postgres;
        `
      });

      if (sqlError) {
        console.log('⚠️ Could not create schema via SQL');
        console.log('Error:', sqlError.message);
        console.log('\nPlease run this SQL in the Supabase dashboard:');
        console.log(`
CREATE SCHEMA IF NOT EXISTS better_auth;
GRANT USAGE ON SCHEMA better_auth TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA better_auth TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA better_auth TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA better_auth GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA better_auth GRANT ALL ON SEQUENCES TO postgres;`);
        return;
      }
    } else {
      // If procedure was created, try to execute it
      const { error: execError } = await supabase.rpc('create_better_auth_schema');
      if (execError) {
        console.log('⚠️ Could not execute schema creation procedure');
        console.log('Error:', execError.message);
        return;
      }
    }

    // Verify schema exists
    const { data: schemaData, error: verifyError } = await supabase
      .from('information_schema.schemata')
      .select('schema_name')
      .eq('schema_name', 'better_auth')
      .maybeSingle();

    if (!verifyError && schemaData) {
      console.log('✅ Schema created and verified');
      console.log('\nNext steps:');
      console.log('1. Run BetterAuth migrations');
      console.log('2. Start your application');
    } else {
      console.log('⚠️ Could not verify schema');
      console.log('Please check manually in Supabase dashboard');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Troubleshooting steps:');
    console.log('1. Check your Supabase dashboard settings:');
    console.log('   - Go to Project Settings > Database');
    console.log('   - Check if database is running (not paused)');
    console.log('   - Verify service role key is correct');
    console.log('\n2. If problems persist:');
    console.log('   - Try creating schema manually in SQL editor');
    console.log('   - Check if your IP is allowed');
    console.log('   - Verify necessary permissions');
  }
}

createSchema().catch(console.error);
