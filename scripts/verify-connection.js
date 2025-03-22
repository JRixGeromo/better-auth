const postgres = require('postgres');
require('dotenv').config();

async function testConnection() {
    console.log('🔍 Testing database connection...');
    
    const dbUrl = process.env.BETTER_AUTH_DATABASE_URL;
    if (!dbUrl) {
        console.error('❌ BETTER_AUTH_DATABASE_URL is not set');
        return;
    }

    // Try both pooler and direct connection
    const urls = [
        dbUrl, // Original URL
        dbUrl.replace(/\/\/(.+?)@db\./, '//$1@') // Direct URL
    ];

    for (const url of urls) {
        try {
            console.log(`\nTesting connection to: ${url.replace(/:.*@/, ':****@')}`);
            
            const sql = postgres(url, {
                ssl: true,
                max: 1,
                idle_timeout: 5,
                connect_timeout: 10
            });

            const result = await sql`SELECT current_database(), current_schema`;
            console.log('✅ Connection successful!');
            console.log('Database:', result[0].current_database);
            console.log('Schema:', result[0].current_schema);
            
            await sql.end();
        } catch (error) {
            console.error('❌ Connection failed:', error.message);
        }
    }
}

testConnection().catch(console.error);
