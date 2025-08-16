import { z } from 'zod';

// Enums
export const userRoleSchema = z.enum(['customer', 'handyman', 'admin', 'insurance_sales']);
export type UserRole = z.infer<typeof userRoleSchema>;

export const handymanTypeSchema = z.enum(['carpenter', 'construction']);
export type HandymanType = z.infer<typeof handymanTypeSchema>;

export const certificationLevelSchema = z.enum(['beginner', 'intermediate', 'advanced', 'expert']);
export type CertificationLevel = z.infer<typeof certificationLevelSchema>;

export const orderStatusSchema = z.enum(['pending', 'accepted', 'in_progress', 'completed', 'cancelled']);
export type OrderStatus = z.infer<typeof orderStatusSchema>;

// User schemas
export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  password: z.string(),
  full_name: z.string(),
  phone: z.string().nullable(),
  role: userRoleSchema,
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type User = z.infer<typeof userSchema>;

export const createUserInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  full_name: z.string(),
  phone: z.string().nullable(),
  role: userRoleSchema
});

export type CreateUserInput = z.infer<typeof createUserInputSchema>;

export const updateUserInputSchema = z.object({
  id: z.number(),
  email: z.string().email().optional(),
  full_name: z.string().optional(),
  phone: z.string().nullable().optional()
});

export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;

// Handyman Profile schemas
export const handymanProfileSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  handyman_type: handymanTypeSchema,
  certification_level: certificationLevelSchema,
  bio: z.string().nullable(),
  location: z.string(),
  experience_years: z.number().int().nonnegative(),
  hourly_rate: z.number().positive(),
  is_available: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type HandymanProfile = z.infer<typeof handymanProfileSchema>;

export const createHandymanProfileInputSchema = z.object({
  user_id: z.number(),
  handyman_type: handymanTypeSchema,
  certification_level: certificationLevelSchema,
  bio: z.string().nullable(),
  location: z.string(),
  experience_years: z.number().int().nonnegative(),
  hourly_rate: z.number().positive()
});

export type CreateHandymanProfileInput = z.infer<typeof createHandymanProfileInputSchema>;

export const updateHandymanProfileInputSchema = z.object({
  id: z.number(),
  certification_level: certificationLevelSchema.optional(),
  bio: z.string().nullable().optional(),
  location: z.string().optional(),
  experience_years: z.number().int().nonnegative().optional(),
  hourly_rate: z.number().positive().optional(),
  is_available: z.boolean().optional()
});

export type UpdateHandymanProfileInput = z.infer<typeof updateHandymanProfileInputSchema>;

// Service schemas
export const serviceSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  base_price: z.number().positive(),
  handyman_type: handymanTypeSchema,
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Service = z.infer<typeof serviceSchema>;

export const createServiceInputSchema = z.object({
  name: z.string(),
  description: z.string(),
  category: z.string(),
  base_price: z.number().positive(),
  handyman_type: handymanTypeSchema
});

export type CreateServiceInput = z.infer<typeof createServiceInputSchema>;

export const updateServiceInputSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  base_price: z.number().positive().optional(),
  handyman_type: handymanTypeSchema.optional()
});

export type UpdateServiceInput = z.infer<typeof updateServiceInputSchema>;

// Portfolio schemas
export const portfolioSchema = z.object({
  id: z.number(),
  handyman_id: z.number(),
  title: z.string(),
  description: z.string(),
  image_url: z.string(),
  created_at: z.coerce.date()
});

export type Portfolio = z.infer<typeof portfolioSchema>;

export const createPortfolioInputSchema = z.object({
  handyman_id: z.number(),
  title: z.string(),
  description: z.string(),
  image_url: z.string()
});

export type CreatePortfolioInput = z.infer<typeof createPortfolioInputSchema>;

// Order schemas
export const orderSchema = z.object({
  id: z.number(),
  customer_id: z.number(),
  handyman_id: z.number(),
  service_id: z.number(),
  description: z.string(),
  location: z.string(),
  estimated_hours: z.number().positive(),
  total_price: z.number().positive(),
  status: orderStatusSchema,
  scheduled_date: z.coerce.date().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Order = z.infer<typeof orderSchema>;

export const createOrderInputSchema = z.object({
  customer_id: z.number(),
  handyman_id: z.number(),
  service_id: z.number(),
  description: z.string(),
  location: z.string(),
  estimated_hours: z.number().positive(),
  scheduled_date: z.coerce.date().nullable()
});

export type CreateOrderInput = z.infer<typeof createOrderInputSchema>;

export const updateOrderStatusInputSchema = z.object({
  id: z.number(),
  status: orderStatusSchema,
  scheduled_date: z.coerce.date().nullable().optional()
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusInputSchema>;

// Review schemas
export const reviewSchema = z.object({
  id: z.number(),
  order_id: z.number(),
  customer_id: z.number(),
  handyman_id: z.number(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().nullable(),
  created_at: z.coerce.date()
});

export type Review = z.infer<typeof reviewSchema>;

export const createReviewInputSchema = z.object({
  order_id: z.number(),
  customer_id: z.number(),
  handyman_id: z.number(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().nullable()
});

export type CreateReviewInput = z.infer<typeof createReviewInputSchema>;

// Search schemas
export const searchHandymanInputSchema = z.object({
  handyman_type: handymanTypeSchema.optional(),
  location: z.string().optional(),
  certification_level: certificationLevelSchema.optional(),
  min_rating: z.number().min(1).max(5).optional(),
  max_hourly_rate: z.number().positive().optional()
});

export type SearchHandymanInput = z.infer<typeof searchHandymanInputSchema>;

export const handymanWithDetailsSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  full_name: z.string(),
  email: z.string(),
  phone: z.string().nullable(),
  handyman_type: handymanTypeSchema,
  certification_level: certificationLevelSchema,
  bio: z.string().nullable(),
  location: z.string(),
  experience_years: z.number().int().nonnegative(),
  hourly_rate: z.number().positive(),
  is_available: z.boolean(),
  average_rating: z.number().nullable(),
  total_reviews: z.number().int().nonnegative(),
  created_at: z.coerce.date()
});

export type HandymanWithDetails = z.infer<typeof handymanWithDetailsSchema>;