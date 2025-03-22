const { createClient } = require('@supabase/supabase-js');
const postgres = require('postgres');
require('dotenv').config();

async function testConnection() {
  console.log('🔍 Testing database connections...\n');

  // Test Supabase client connection
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  try {
    console.log('1️⃣ Testing Supabase client connection...');
    const { data, error } = await supabase
      .from('_prisma_migrations')
      .select('*')
      .limit(1);

    if (error && !error.message.includes('relation "public._prisma_migrations" does not exist')) {
      throw error;
    }
    console.log('✅ Supabase client connection successful\n');
  } catch (error) {
    console.error('❌ Supabase client connection failed:', error.message, '\n');
  }

  // Test pooler connection
  console.log('2️⃣ Testing pooler connection...');
  
  try {
    // Initialize postgres client with same config as db.ts
    const sql = postgres(process.env.BETTER_AUTH_DATABASE_URL, {
      ssl: {
        rejectUnauthorized: false // Required for Supabase pooler's self-signed cert
      },
      max: 1,
      idle_timeout: 0,
      connect_timeout: 10,
      connection: {
        application_name: 'better-auth'
      }
    });

    // Test the connection
    console.log('Attempting database connection...');
    const result = await sql`SELECT current_database(), current_schema`;
    console.log('✅ Pooler connection successful');
    console.log('Database:', result[0].current_database);
    console.log('Schema:', result[0].current_schema);

    // Try to create schema and set permissions
    console.log('\n3️⃣ Testing schema creation...');
    
    try {
      // Create schema if it doesn't exist
      await sql`CREATE SCHEMA IF NOT EXISTS better_auth`;
      console.log('✅ Schema created/verified');

      // Grant permissions one by one
      await sql`GRANT USAGE ON SCHEMA better_auth TO postgres`;
      await sql`GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA better_auth TO postgres`;
      await sql`GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA better_auth TO postgres`;
      await sql`ALTER DEFAULT PRIVILEGES IN SCHEMA better_auth GRANT ALL ON TABLES TO postgres`;
      await sql`ALTER DEFAULT PRIVILEGES IN SCHEMA better_auth GRANT ALL ON SEQUENCES TO postgres`;
      console.log('✅ Permissions granted successfully');

    } catch (schemaError) {
      if (schemaError.message.includes('permission denied')) {
        console.log('\n⚠️ Permission error creating schema. This is normal if using connection pooler.');
        console.log('Please create the schema manually in the Supabase dashboard:');
        console.log('1. Go to Supabase Dashboard > Database > Extensions');
        console.log('2. Create schema "better_auth"');
        console.log('3. Grant necessary permissions');
      } else {
        throw schemaError;
      }
    }

    // Close connection
    await sql.end();

  } catch (error) {
    console.error('❌ Database operation failed:', error.message);
    if (error.message.includes('permission denied')) {
      console.log('\n💡 Permission error detected. Please check:');
      console.log('1. Service role key has necessary permissions');
      console.log('2. Database user has schema creation rights');
      console.log('3. Try creating schema manually in Supabase dashboard');
    } else if (error.message.includes('CONNECT_TIMEOUT')) {
      console.log('\n💡 Connection timeout detected. Please check:');
      console.log('1. Network connectivity to Supabase');
      console.log('2. Firewall settings');
      console.log('3. VPN or proxy settings if applicable');
    } else {
      console.log('\n💡 Connection error detected. Please verify:');
      console.log('1. Database URL format is correct');
      console.log('2. SSL settings are properly configured');
      console.log('3. Database credentials are valid');
    }
  }
}

testConnection().catch(console.error);
