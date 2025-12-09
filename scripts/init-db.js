// Initializes the Postgres tables used by the app
const { sql } = require('@vercel/postgres');

async function main() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS calendars (
        id UUID PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        timezone TEXT NOT NULL,
        token TEXT NOT NULL,
        created_at BIGINT NOT NULL,
        days JSONB NOT NULL
      );
    `;
    console.log('✅ Postgres tables initialized.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to initialize Postgres tables:', err);
    process.exit(1);
  }
}

main();
