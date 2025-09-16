import 'dotenv/config';

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drzle-orm/neon-http';

const sql = neon(process.env.DATABASE_URL);

const db = drizzle(sql);

export { db, sql };
