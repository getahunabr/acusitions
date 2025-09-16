import {
  pgTable,
  serial,
  timestamp,
  varchar,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    password: varchar('password', { length: 255 }).notNull(),
    role: varchar('role', { length: 50 }).notNull().default('user'),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  },
  table => {
    return {
      emailUnique: uniqueIndex('users_email_unique').on(table.email),
    };
  }
);
