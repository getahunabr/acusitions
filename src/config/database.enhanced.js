import 'dotenv/config';
import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// Configuration for Neon Local development environment
// This setup works with both development (Neon Local) and production (Neon Cloud)
if (process.env.NODE_ENV === 'development') {
  // Configure Neon serverless driver for Neon Local
  // Check if we're using Neon Local (development) or regular Neon (production)
  const isNeonLocal =
    process.env.DATABASE_URL?.includes('neon-local') ||
    process.env.DATABASE_URL?.includes('localhost:5432');

  if (isNeonLocal) {
    // Configure for Neon Local proxy
    const dbHost = process.env.DATABASE_URL.includes('neon-local')
      ? 'neon-local'
      : 'localhost';

    // Update neonConfig for HTTP-only communication with Neon Local
    neonConfig.fetchEndpoint = `http://${dbHost}:5432/sql`;
    neonConfig.useSecureWebSocket = false;
    neonConfig.poolQueryViaFetch = true;

    console.log(
      '🔧 Configured Neon driver for local development with Neon Local'
    );
  } else {
    console.log('🔧 Using standard Neon configuration for development');
  }
} else {
  // Production configuration - use default Neon settings
  console.log('🚀 Using Neon Cloud configuration for production');
}

// Create the database connection
const sql = neon(process.env.DATABASE_URL);

// Create Drizzle instance
const db = drizzle(sql);

// Connection test function
export const testConnection = async () => {
  try {
    const result =
      await sql`SELECT NOW() as current_time, version() as pg_version`;
    console.log('✅ Database connected successfully');
    console.log(`📅 Server time: ${result[0].current_time}`);
    console.log(
      `🐘 PostgreSQL: ${result[0].pg_version.split(' ')[0]} ${result[0].pg_version.split(' ')[1]}`
    );
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

// Export database connections
export { db, sql };

// For debugging in development
if (process.env.NODE_ENV === 'development') {
  console.log('🔍 Database configuration:');
  console.log(`   NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(
    `   DATABASE_URL: ${process.env.DATABASE_URL ? 'Set' : 'Not set'}`
  );
  console.log(`   Neon Config:`, {
    fetchEndpoint: neonConfig.fetchEndpoint,
    useSecureWebSocket: neonConfig.useSecureWebSocket,
    poolQueryViaFetch: neonConfig.poolQueryViaFetch,
  });
}
