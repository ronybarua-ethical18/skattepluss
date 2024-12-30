import httpStatus from 'http-status';
import { z } from 'zod'; // Import Zod for validation
import { publicProcedure, router } from '@/server/trpc';
import User from '@/server/db/models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; // Import JWT for token generation
import { authValidation } from './auth.validation';
import { generateTokenAndSendMail } from '@/utils/helpers/generateToken';
import { ApiError } from '@/lib/exceptions';

export const authRouter = router({
  // Sign Up Procedure
  signup: publicProcedure
    .input(authValidation.signupSchema) // Validate input with Zod schema
    .mutation(async ({ input }) => {
      const { email, password, firstName, lastName /* role */ } = input;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('User already exists'); // Handle user already existing
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = new User({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        /* role, */
      });

      await newUser.save(); // Save user to the database

      await generateTokenAndSendMail(
        newUser,
        'New Account Registration - Skattepluss'
      );

      return {
        message: 'User registered successfully, please verify your email.',
        status: 200,
        user: newUser,
      };
    }),
  forgotPassword: publicProcedure
    .input(
      z.object({
        email: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { email } = input;

      // Find the user by ID
      const user = await User.findOne({ email: email });
      if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
      }

      await generateTokenAndSendMail(user, 'Password Reset');
      return {
        message:
          'Password reset link has been sent to your email. Please check.',
        status: 200,
      };
    }),
  verifyEmail: publicProcedure
    .input(
      z.object({
        token: z.string(), // Expect a token as input
      })
    )
    .mutation(async ({ input }) => {
      const { token } = input;

      // Decode the token and extract user info
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        id: string;
      };

      // Find the user by ID
      const user = await User.findById(decoded.id);
      if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
      }

      // Check if the user is already verified
      if (user.isVerified) {
        return {
          message: 'User is already verified.',
          alreadyVerified: true,
          status: 200,
        };
      }

      // Update the user's verification status
      user.isVerified = true;
      await user.save();

      return {
        message: 'Email verified successfully.',
        status: 200,
        alreadyVerified: false,
        data: user,
      };
    }),
  resetPassword: publicProcedure
    .input(
      z.object({
        token: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { token, password } = input;

      // Verify token and extract user ID
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
          id: string;
        };
      } catch (error) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          `Invalid or expired token:${error}`
        );
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Find user by ID and update the password
      const updatedUser = await User.findByIdAndUpdate(
        decoded.id,
        { password: hashedPassword },
        { new: true }
      );

      if (!updatedUser) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
      }

      return {
        message: 'Password has been changed successfully',
        status: 200,
        data: updatedUser,
      };
    }),
});
