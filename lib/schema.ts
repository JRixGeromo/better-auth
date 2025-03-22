import { pgTable, text, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent')
});

export const accounts = pgTable('accounts', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  accountId: text('account_id').notNull(),  // This is required by Better Auth
  providerId: text('provider_id').notNull(),  // This is required by Better Auth (e.g., 'credentials')
  type: text('type').notNull(),  // 'oauth' | 'email' | 'credentials'
  provider: text('provider').notNull(),  // The provider type (e.g., 'github', 'credentials')
  providerAccountId: text('provider_account_id').notNull(),  // Usually the email for credentials
  providerType: text('provider_type'),  // OAuth provider type
  refreshToken: text('refresh_token'),  // OAuth refresh token
  accessToken: text('access_token'),  // OAuth access token
  expiresAt: timestamp('expires_at'),  // OAuth token expiry
  tokenType: text('token_type'),  // OAuth token type
  scope: text('scope'),  // OAuth scopes
  idToken: text('id_token'),  // OAuth ID token
  sessionState: text('session_state'),  // OAuth session state
  password: text('password'),  // Hashed password for credentials provider
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const verifications = pgTable('verifications', { 
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});
