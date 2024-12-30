import httpStatus from 'http-status';
import bcrypt from 'bcrypt';
import { protectedProcedure } from '@/server/middlewares/with-auth';
import { router } from '@/server/trpc';
import { JwtPayload } from 'jsonwebtoken';
import { ApiResponse } from '@/server/db/types';
import { errorHandler } from '@/server/middlewares/error-handler';
import { ApiError } from '@/lib/exceptions';
import { auditorValidation } from './auditor.validation';
import AuditorModel from '@/server/db/models/auditor';
import User from '@/server/db/models/user';
import jwt from 'jsonwebtoken';
import { AUDITOR_VERIFY_EMAIL_TEMPLATE } from '@/server/services/mail/constants';
import sendEmail from '@/server/services/mail/sendMail';
import { AuditorStatus } from '@/server/db/interfaces/auditor';
import { z } from 'zod';

export const auditorRouter = router({
  inviteAuditor: protectedProcedure
    .input(auditorValidation.auditorSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { auditor_email, message } = input;

        const sessionUser = ctx.user as JwtPayload;

        if (!sessionUser || !sessionUser?.email) {
          throw new Error('You must be logged in to update this data.');
        }

        const isEmailExist = await User.findOne({ email: auditor_email });

        if (isEmailExist) {
          throw new ApiError(
            httpStatus.BAD_REQUEST,
            'A user with this email address already exists.'
          );
        }

        // Generate JWT token for email verification
        const token = jwt.sign(
          { email: auditor_email, role: 'auditor' }, // Payload (user info)
          process.env.JWT_SECRET as string, // JWT secret from env
          { expiresIn: '1h' } // Token expiration
        );

        // Send verification email with the token
        const emailSent = await sendEmail(
          [auditor_email],
          {
            subject: 'Auditor Invitation Mail',
            data: {
              invited_by: sessionUser?.name,
              message: message,
              token: `${process.env.CLIENT_URL}?token=${token}&role=auditor`,
            },
          },
          AUDITOR_VERIFY_EMAIL_TEMPLATE
        );

        // Only proceed with user and auditor creation if email is sent successfully
        if (emailSent) {
          const user = await User.create({
            email: auditor_email,
            role: 'auditor',
            password: 'not set',
          });
          const auditor = await AuditorModel.create({
            customer: sessionUser.id,
            auditor: user._id,
            auditor_email,
          });

          return {
            message: 'Auditor is invited successfully',
            status: 200,
            data: auditor,
          } as ApiResponse<typeof auditor>;
        } else {
          throw new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'Failed to send invitation email'
          );
        }
      } catch (error: unknown) {
        const { message } = errorHandler(error);
        throw new ApiError(httpStatus.NOT_FOUND, message);
      }
    }),
  verifyAuditor: protectedProcedure
    .input(auditorValidation.verifyAuditorSchema)
    .mutation(async ({ input }) => {
      const { token, password, ...rest } = input;

      try {
        // Decode the token and extract user info
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
          email: string;
        };

        // Find the user by email
        const user = await User.findOne({ email: decoded.email });
        if (!user) {
          throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
        }

        // Check if user is already verified
        if (user.isVerified) {
          return {
            message: 'Account is already verified.',
            status: 200,
            alreadyVerified: true,
            data: user,
          };
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user with new password and verification status
        const updatedUser = await User.findOneAndUpdate(
          { email: decoded.email },
          { ...rest, password: hashedPassword, isVerified: true },
          { new: true }
        );

        // Update auditor status if user update was successful
        if (updatedUser) {
          await AuditorModel.findOneAndUpdate(
            { auditor: updatedUser._id },
            { status: AuditorStatus.VERIFIED },
            { new: true }
          );
        }

        return {
          message: 'Account is verified successfully.',
          status: 200,
          alreadyVerified: false,
          data: updatedUser,
        };
      } catch (error) {
        // Handle potential JWT verification errors
        if (error instanceof jwt.JsonWebTokenError) {
          throw new ApiError(
            httpStatus.UNAUTHORIZED,
            'Invalid or expired token'
          );
        }

        const { message } = errorHandler(error);
        throw new ApiError(httpStatus.NOT_FOUND, message);
      }
    }),
  getAuditorsOrCustomers: protectedProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(100),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const loggedUser = ctx.user as JwtPayload;
        const { page, limit } = input;
        const skip = (page - 1) * limit;

        const auditorOrCustomers = await AuditorModel.find({
          $or: [{ customer: loggedUser.id }, { auditor: loggedUser.id }],
        })
          .populate('customer auditor', 'firstName lastName')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit);

        return {
          status: 200,
          message: 'Auditors fetched successfully',
          data: auditorOrCustomers,
        } as ApiResponse<typeof auditorOrCustomers>;
      } catch (error: unknown) {
        const { message } = errorHandler(error);
        throw new ApiError(httpStatus.NOT_FOUND, message);
      }
    }),
});
