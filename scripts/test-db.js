const { Client } = require('pg');
require('dotenv').config();

async function testConnection() {
  const client = new Client({
    connectionString: process.env.BETTER_AUTH_DATABASE_URL,
    ssl: false
  });

  try {
    console.log('Attempting to connect to database...');
    await client.connect();
    console.log('Successfully connected to database!');
    
    // Try to create schema
    await client.query(`
      CREATE SCHEMA IF NOT EXISTS better_auth;
    `);
    console.log('Schema created or already exists');
    
    // List schemas
    const { rows } = await client.query(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name = 'better_auth';
    `);
    console.log('Schema check:', rows);
    
  } catch (error) {
    console.error('Database connection error:', error);
  } finally {
    await client.end();
  }
}

testConnection();
