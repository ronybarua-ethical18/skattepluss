import { AuthOptions, Session } from 'next-auth';
import { Account, User as AuthUser, Profile } from 'next-auth';
import bcrypt from 'bcrypt';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import connectToDatabase from '@/server/config/mongoose';
import User from '@/server/db/models/user';
import { JWT } from 'next-auth/jwt';
import AuditorModel from '@/server/db/models/auditor';

declare module 'next-auth' {
  interface User {
    id: string;
    role: string;
    firstName: string;
    lastName: string;
    hasAnswers: boolean;
    audit_for?: string;
    customer_email?: string;
  }

  interface Session {
    user: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role?: string;
    firstName?: string;
    lastName?: string;
    hasAnswers?: boolean;
    audit_for?: string;
    customer_email?: string;
    name?: string;
  }
}

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password) {
          throw new Error('Invalid credentials');
        }
        await connectToDatabase();
        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error('User not found');
        }
        if (user && !user?.isVerified) {
          throw new Error('Please verify your email first!');
        }

        if (user) {
          if (credentials.password === user.password) {
            return user;
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (isPasswordCorrect) {
            return user;
          }
        }
        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],

  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({
      user,
      account,
    }: {
      user: AuthUser;
      account: Account | null;
      profile?: Profile | undefined;
    }): Promise<boolean> {
      if (account?.provider === 'google') {
        await connectToDatabase();
        try {
          const existingUser = await User.findOne({ email: user.email });
          if (!existingUser) {
            const newUser = new User({
              email: user.email,
              firstName: user.name,
              lastName: user.name,
              role: 'customer',
              provider: 'google',
              image: user?.image || '',
              isVerified: true,
            });
            await newUser.save();
          }
          return true;
        } catch (err) {
          console.error('Error saving user during Google sign-in', err);
          return false;
        }
      }

      if (account?.provider === 'credentials') {
        return true;
      }

      return false;
    },
    async jwt({
      token,
      user,
    }: {
      token: JWT;
      user: AuthUser | null;
    }): Promise<JWT> {
      if (user) {
        const retrievedUser = await User.findOne({ email: user.email });

        if (retrievedUser) {
          token.id = retrievedUser.id;

          if (retrievedUser.role === 'auditor') {
            const auditor = await AuditorModel.find({
              auditor: retrievedUser._id,
            }).populate('customer', 'firstName email');

            if (auditor && auditor.length > 0) {
              token.id = auditor[0].customer._id;
              token.audit_for = auditor[0].customer.firstName;
              token.customer_email = auditor[0].customer.email;
            }
          }

          token.email = retrievedUser.email;
          token.firstName = retrievedUser.firstName || user.name;
          token.lastName = retrievedUser.lastName;
          token.role = retrievedUser.role || 'customer';
          token.hasAnswers = retrievedUser.questionnaires?.length > 0;
        }
      }
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }): Promise<Session> {
      session.user = {
        id: token.id,
        role: token.role || 'customer',
        email: token.email as string,
        firstName: token.firstName || token.name || '',
        lastName: token.lastName || '',
        hasAnswers: token.hasAnswers || false,
        audit_for: token.audit_for || '',
        customer_email: token.customer_email || '',
      };

      return session;
    },
  },
};
