import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schema types
import {
  createUserInputSchema,
  updateUserInputSchema,
  createHandymanProfileInputSchema,
  updateHandymanProfileInputSchema,
  createServiceInputSchema,
  updateServiceInputSchema,
  createPortfolioInputSchema,
  createOrderInputSchema,
  updateOrderStatusInputSchema,
  createReviewInputSchema,
  searchHandymanInputSchema,
  userRoleSchema,
  handymanTypeSchema
} from './schema';

// Import handlers
import { createUser } from './handlers/create_user';
import { getUsers, getUsersByRole } from './handlers/get_users';
import { updateUser } from './handlers/update_user';
import { createHandymanProfile } from './handlers/create_handyman_profile';
import { getHandymanProfiles, getHandymanById, searchHandymen } from './handlers/get_handyman_profiles';
import { updateHandymanProfile } from './handlers/update_handyman_profile';
import { createService } from './handlers/create_service';
import { getServices, getServicesByType, getServiceById } from './handlers/get_services';
import { updateService } from './handlers/update_service';
import { createPortfolio } from './handlers/create_portfolio';
import { getPortfoliosByHandyman, getPortfolioById, deletePortfolio } from './handlers/get_portfolios';
import { createOrder } from './handlers/create_order';
import { getOrdersByCustomer, getOrdersByHandyman, getOrderById, getAllOrders } from './handlers/get_orders';
import { updateOrderStatus } from './handlers/update_order_status';
import { createReview } from './handlers/create_review';
import { getReviewsByHandyman, getReviewsByCustomer, getReviewByOrder, getHandymanRatingStats } from './handlers/get_reviews';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // User management
  createUser: publicProcedure
    .input(createUserInputSchema)
    .mutation(({ input }) => createUser(input)),
  
  getUsers: publicProcedure
    .query(() => getUsers()),
  
  getUsersByRole: publicProcedure
    .input(userRoleSchema)
    .query(({ input }) => getUsersByRole(input)),
  
  updateUser: publicProcedure
    .input(updateUserInputSchema)
    .mutation(({ input }) => updateUser(input)),

  // Handyman profile management
  createHandymanProfile: publicProcedure
    .input(createHandymanProfileInputSchema)
    .mutation(({ input }) => createHandymanProfile(input)),
  
  getHandymanProfiles: publicProcedure
    .query(() => getHandymanProfiles()),
  
  getHandymanById: publicProcedure
    .input(z.number())
    .query(({ input }) => getHandymanById(input)),
  
  searchHandymen: publicProcedure
    .input(searchHandymanInputSchema)
    .query(({ input }) => searchHandymen(input)),
  
  updateHandymanProfile: publicProcedure
    .input(updateHandymanProfileInputSchema)
    .mutation(({ input }) => updateHandymanProfile(input)),

  // Service management
  createService: publicProcedure
    .input(createServiceInputSchema)
    .mutation(({ input }) => createService(input)),
  
  getServices: publicProcedure
    .query(() => getServices()),
  
  getServicesByType: publicProcedure
    .input(handymanTypeSchema)
    .query(({ input }) => getServicesByType(input)),
  
  getServiceById: publicProcedure
    .input(z.number())
    .query(({ input }) => getServiceById(input)),
  
  updateService: publicProcedure
    .input(updateServiceInputSchema)
    .mutation(({ input }) => updateService(input)),

  // Portfolio management
  createPortfolio: publicProcedure
    .input(createPortfolioInputSchema)
    .mutation(({ input }) => createPortfolio(input)),
  
  getPortfoliosByHandyman: publicProcedure
    .input(z.number())
    .query(({ input }) => getPortfoliosByHandyman(input)),
  
  getPortfolioById: publicProcedure
    .input(z.number())
    .query(({ input }) => getPortfolioById(input)),
  
  deletePortfolio: publicProcedure
    .input(z.number())
    .mutation(({ input }) => deletePortfolio(input)),

  // Order management
  createOrder: publicProcedure
    .input(createOrderInputSchema)
    .mutation(({ input }) => createOrder(input)),
  
  getOrdersByCustomer: publicProcedure
    .input(z.number())
    .query(({ input }) => getOrdersByCustomer(input)),
  
  getOrdersByHandyman: publicProcedure
    .input(z.number())
    .query(({ input }) => getOrdersByHandyman(input)),
  
  getOrderById: publicProcedure
    .input(z.number())
    .query(({ input }) => getOrderById(input)),
  
  getAllOrders: publicProcedure
    .query(() => getAllOrders()),
  
  updateOrderStatus: publicProcedure
    .input(updateOrderStatusInputSchema)
    .mutation(({ input }) => updateOrderStatus(input)),

  // Review management
  createReview: publicProcedure
    .input(createReviewInputSchema)
    .mutation(({ input }) => createReview(input)),
  
  getReviewsByHandyman: publicProcedure
    .input(z.number())
    .query(({ input }) => getReviewsByHandyman(input)),
  
  getReviewsByCustomer: publicProcedure
    .input(z.number())
    .query(({ input }) => getReviewsByCustomer(input)),
  
  getReviewByOrder: publicProcedure
    .input(z.number())
    .query(({ input }) => getReviewByOrder(input)),
  
  getHandymanRatingStats: publicProcedure
    .input(z.number())
    .query(({ input }) => getHandymanRatingStats(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();