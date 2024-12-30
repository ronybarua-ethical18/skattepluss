import { inferAsyncReturnType } from '@trpc/server';
import connectToDatabase from './config/mongoose';
import mongoose from 'mongoose';
import { getToken } from 'next-auth/jwt';
import { NextApiRequest } from 'next';

// Define the type for the incoming request
interface CreateContextOptions {
  req: Request;
}

export const createContext = async ({ req }: CreateContextOptions) => {
  // Convert the Request object to a compatible type for NextAuth functions
  const cookies = Object.fromEntries(
    req.headers
      .get('cookie')
      ?.split('; ')
      .map((c) => c.split('=')) || []
  );

  const transformedReq = {
    headers: {
      ...Object.fromEntries(req.headers),
      cookie: req.headers.get('cookie') || '',
    },
    cookies,
    method: req.method,
    url: req.url,
  } as unknown as NextApiRequest;

  // Use getToken to retrieve the JWT token
  const token = await getToken({
    req: transformedReq,
  });

  // Connect to the database
  await connectToDatabase();

  return {
    user: token || null,
    token: token || null,
    db: mongoose.connection,
  };
};

// Define the context type using inferAsyncReturnType
export type Context = inferAsyncReturnType<typeof createContext>;
