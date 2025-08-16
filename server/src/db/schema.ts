import { serial, text, pgTable, timestamp, numeric, integer, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Define enums
export const userRoleEnum = pgEnum('user_role', ['customer', 'handyman', 'admin', 'insurance_sales']);
export const handymanTypeEnum = pgEnum('handyman_type', ['carpenter', 'construction']);
export const certificationLevelEnum = pgEnum('certification_level', ['beginner', 'intermediate', 'advanced', 'expert']);
export const orderStatusEnum = pgEnum('order_status', ['pending', 'accepted', 'in_progress', 'completed', 'cancelled']);

// Users table
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  full_name: text('full_name').notNull(),
  phone: text('phone'),
  role: userRoleEnum('role').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Handyman profiles table
export const handymanProfilesTable = pgTable('handyman_profiles', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => usersTable.id),
  handyman_type: handymanTypeEnum('handyman_type').notNull(),
  certification_level: certificationLevelEnum('certification_level').notNull(),
  bio: text('bio'),
  location: text('location').notNull(),
  experience_years: integer('experience_years').notNull().default(0),
  hourly_rate: numeric('hourly_rate', { precision: 10, scale: 2 }).notNull(),
  is_available: boolean('is_available').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Services table
export const servicesTable = pgTable('services', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(),
  base_price: numeric('base_price', { precision: 10, scale: 2 }).notNull(),
  handyman_type: handymanTypeEnum('handyman_type').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Portfolio table
export const portfoliosTable = pgTable('portfolios', {
  id: serial('id').primaryKey(),
  handyman_id: integer('handyman_id').notNull().references(() => handymanProfilesTable.id),
  title: text('title').notNull(),
  description: text('description').notNull(),
  image_url: text('image_url').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Orders table
export const ordersTable = pgTable('orders', {
  id: serial('id').primaryKey(),
  customer_id: integer('customer_id').notNull().references(() => usersTable.id),
  handyman_id: integer('handyman_id').notNull().references(() => handymanProfilesTable.id),
  service_id: integer('service_id').notNull().references(() => servicesTable.id),
  description: text('description').notNull(),
  location: text('location').notNull(),
  estimated_hours: numeric('estimated_hours', { precision: 5, scale: 2 }).notNull(),
  total_price: numeric('total_price', { precision: 10, scale: 2 }).notNull(),
  status: orderStatusEnum('status').notNull().default('pending'),
  scheduled_date: timestamp('scheduled_date'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Reviews table
export const reviewsTable = pgTable('reviews', {
  id: serial('id').primaryKey(),
  order_id: integer('order_id').notNull().references(() => ordersTable.id),
  customer_id: integer('customer_id').notNull().references(() => usersTable.id),
  handyman_id: integer('handyman_id').notNull().references(() => handymanProfilesTable.id),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(usersTable, ({ one, many }) => ({
  handymanProfile: one(handymanProfilesTable, {
    fields: [usersTable.id],
    references: [handymanProfilesTable.user_id],
  }),
  customerOrders: many(ordersTable, { relationName: 'customerOrders' }),
  customerReviews: many(reviewsTable, { relationName: 'customerReviews' }),
}));

export const handymanProfilesRelations = relations(handymanProfilesTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [handymanProfilesTable.user_id],
    references: [usersTable.id],
  }),
  portfolios: many(portfoliosTable),
  handymanOrders: many(ordersTable, { relationName: 'handymanOrders' }),
  handymanReviews: many(reviewsTable, { relationName: 'handymanReviews' }),
}));

export const servicesRelations = relations(servicesTable, ({ many }) => ({
  orders: many(ordersTable),
}));

export const portfoliosRelations = relations(portfoliosTable, ({ one }) => ({
  handyman: one(handymanProfilesTable, {
    fields: [portfoliosTable.handyman_id],
    references: [handymanProfilesTable.id],
  }),
}));

export const ordersRelations = relations(ordersTable, ({ one }) => ({
  customer: one(usersTable, {
    fields: [ordersTable.customer_id],
    references: [usersTable.id],
    relationName: 'customerOrders',
  }),
  handyman: one(handymanProfilesTable, {
    fields: [ordersTable.handyman_id],
    references: [handymanProfilesTable.id],
    relationName: 'handymanOrders',
  }),
  service: one(servicesTable, {
    fields: [ordersTable.service_id],
    references: [servicesTable.id],
  }),
  review: one(reviewsTable, {
    fields: [ordersTable.id],
    references: [reviewsTable.order_id],
  }),
}));

export const reviewsRelations = relations(reviewsTable, ({ one }) => ({
  order: one(ordersTable, {
    fields: [reviewsTable.order_id],
    references: [ordersTable.id],
  }),
  customer: one(usersTable, {
    fields: [reviewsTable.customer_id],
    references: [usersTable.id],
    relationName: 'customerReviews',
  }),
  handyman: one(handymanProfilesTable, {
    fields: [reviewsTable.handyman_id],
    references: [handymanProfilesTable.id],
    relationName: 'handymanReviews',
  }),
}));

// Export all tables for proper query building
export const tables = {
  users: usersTable,
  handymanProfiles: handymanProfilesTable,
  services: servicesTable,
  portfolios: portfoliosTable,
  orders: ordersTable,
  reviews: reviewsTable,
};