const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function checkLogs() {
  console.log('📋 Checking Supabase logs...\n');

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
    // Get database logs
    console.log('1️⃣ Database logs:');
    const { data: dbLogs, error: dbError } = await supabase
      .from('_database_log')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(10);

    if (dbError) {
      console.error('❌ Error fetching database logs:', dbError.message);
    } else if (dbLogs && dbLogs.length > 0) {
      dbLogs.forEach(log => {
        console.log(`\n[${new Date(log.timestamp).toISOString()}]`);
        console.log('Message:', log.message);
        if (log.error) console.log('Error:', log.error);
      });
    } else {
      console.log('No database logs found');
    }

    // Get auth logs
    console.log('\n2️⃣ Auth logs:');
    const { data: authLogs, error: authError } = await supabase
      .from('_auth_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (authError) {
      console.error('❌ Error fetching auth logs:', authError.message);
    } else if (authLogs && authLogs.length > 0) {
      authLogs.forEach(log => {
        console.log(`\n[${new Date(log.created_at).toISOString()}]`);
        console.log('Event:', log.event);
        if (log.error) console.log('Error:', log.error);
      });
    } else {
      console.log('No auth logs found');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkLogs().catch(console.error);
