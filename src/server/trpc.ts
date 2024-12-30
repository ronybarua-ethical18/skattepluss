// /server/trpc.ts
import { initTRPC } from '@trpc/server';
import { createContext } from './context';

// Initialize tRPC
export const t = initTRPC.context<ReturnType<typeof createContext>>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        customMessage: error.message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
      },
    };
  },
});

// Export the main router and other utilities
export const middleware = t.middleware;
export const router = t.router;
export const publicProcedure = t.procedure;
